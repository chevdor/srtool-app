import React from 'react';
import * as fs from 'fs'
import unzipper from 'unzipper'
import { defaultSettings, Settings, SettingsContextContent } from './settings';
import VersionControlSystem, { Service } from './vcs';
import DockerWrapper from './dockerWrapper';
import Dockerode from 'dockerode';
import { Writable } from 'stream';
import { isResult, Message, MessageBuilder, SRToolOutput, SRToolResult, SRToolResultBuilder } from './message';
import { RunnerConfig } from '../components/runnerConfig';
import SettingsContext from '../contexts/settingsContext';
import { containerName, folderBase } from '../constants';
import { assert } from './assert';
import * as Path from 'path'

/**
 * The Runner is the class that is doing the work of calling
 * srtool.
 */
class Runner extends React.Component<any, any> {
    #onDataCb: (data: string) => void;
    #docker: DockerWrapper;
    #settings: SettingsContextContent;

    constructor(settings: SettingsContextContent) {
        super(null)
        this.#onDataCb = (_data: string) => { };
        this.#docker = new DockerWrapper();
        this.#settings = settings;
    }

    public set onData(cb: (data: string) => void) {
        if (!cb) throw new Error('Invalid onData callback')
        this.#onDataCb = cb;
    }

    public get settings(): SettingsContextContent {
        return this.#settings;
    }

    /**
     * Fetch a given version from a given repo and store it in
     * our workDir.
     * repo: https://codeload.github.com/paritytech/polkadot
     * tag: v0.8.28
     * url: https://codeload.github.com/paritytech/polkadot/zip/v0.8.28
      * @param owner The owner of the repo. ie `paritytech`
      * @param repo The repo name. ie `polkadot`
      * @param tag The tag of the version to fetch
      */
    private async fetchArchive(service: Service, owner: string, repo: string, tag: string): Promise<string> {
        const vcs = new VersionControlSystem(service, owner, repo);
        assert(this.settings, 'no settings')
        const destination = Path.join(this.settings.local.workDir, `${owner}-${repo}-${tag}.zip`); // TODO WORKDIR: move to workdir
        await vcs.fetchSourceArchive(tag, destination)
        return destination
    }

    /**
     * Unzip an archive 
     * For instance `/tmp/myzip.zip` may unzip into `/tmp/polkadot-v0.28.8`
     * @param zipfile ie `/tmp/myzip.zip`
     */
    private async unzip(zipfile: string, workdir: string): Promise<void> {
        console.log(`Unzipping ${zipfile}`);
        return new Promise((resolve, _reject) => {
            fs.createReadStream(zipfile)
                .pipe(unzipper.Extract({ path: workdir }))
                .on('close', () => {
                    resolve();
                });
        })
    }

    /**
     * Delete the zip archive. You should do that after unzipping
     * @param zipfile 
     */
    private async deleteZip(zipfile: string): Promise<void> {
        console.log(`Deleting zip at ${zipfile}`);
        return new Promise((resolve, reject) => {
            try {
                fs.unlinkSync(zipfile);
                resolve()
            } catch (err) {
                reject(err)
            }
        })
    }

    /**
     * Fetches the source and return the location where it is located.
     * This is actually calling `fetchArchive`, `unzip` and `deleteZip`.
     * @param service 
     * @param owner 
     * @param repo 
     * @param tag 
     */
    public async fetchSource(service: Service, owner: string, repo: string, tag: string, workdir: string): Promise<string> {
        assert(tag.indexOf('refs') < 0, `We need a tag here, not a ref, you passed ${tag}`)

        const zip = await this.fetchArchive(service, owner, repo, tag);
        console.log("zip located at", zip);

        console.log('Unzipping');
        await this.unzip(zip, workdir);
        console.log('Unzipping done');

        const folder = `${workdir}/${repo}-${tag.replace("v", "")}`;
        console.log("Unzipped in", folder);
        await this.deleteZip(zip);

        return folder;
    }

    /**
     * Delete folder where we worked.
     * WARNING: Only call this in `httpGet` mode and NOT in `user` mode.
     * @param folder 
     */
    public async cleanup(folder: string): Promise<void> {
        console.log(`Deleting the folder ${folder}`);
        assert(
            folder.indexOf(folderBase) >= 0,
            `That does not look like a folder we should delete, we got: ${folder}`
        );

        const opt = { recursive: true, force: true };
        return fs.promises.rmdir(folder, opt);
    }

    /**
     * If some srtool container was left behind however, we delete it before it causes issues.
     */
    public async prepare(): Promise<void> {
        console.log('Deleting old `srtool` container if any can be found');

        const container = await this.#docker.getContainer()

        if (container) {
            await container.stop()
            // all of our containers start with --rm so it *should* be enough
            // however, the user may start srtool manually...
            try {
                await container.remove()
            } catch (_e) { }
        }
        console.log('Done preparing');
    }

    /**
     * This is the function that is actually running the srtool container.
     * 
     * @param p 
     * @returns 
     */
    public async run(params: RunnerConfig): Promise<SRToolResult> {
        console.log('Running srtool using', params);
        assert(params.package, 'We need a package to run !')
        const { image, package: runtime } = params;
        const image_args = ['build', '--app']; // --app is critical! 
        let result: SRToolResult;

        return new Promise((resolve, reject) => {
            const outStream = new Writable();
            const StringDecoder = require('string_decoder').StringDecoder;
            const decoder = new StringDecoder();
            let output = ''
            let lastLine = ''

            outStream._write = (doc: any, _encoding: any, next: () => void) => {
                let manyLines = decoder.write(doc);
                // console.log('>', manyLines);
                output += manyLines;
                manyLines.split('\r\n')
                    .filter((line: string | any[]) => line.length)
                    .forEach((line: string) => {
                        this.#onDataCb(line);
                        lastLine = line;     // TODO LATER: we could optimize here and set only the last one

                        // lastLine is a string so it will never be a result unless we build it
                        const msg: Message = MessageBuilder.build(lastLine)

                        if (isResult(msg.content)) {
                            result = msg.content
                            console.log('result set to', result);

                            // resolve(result)
                        } 
                        // else {
                        //     console.log('lastline is not result', lastLine);
                        // }
                    })
                next()
            };

            const handler = (error: any, data: any, container: any) => {
                if (error) {
                    reject(error)
                } else {
                    // console.log('handler data', data);
                    const { StatusCode: code } = data;

                    console.info(`Exit code: ${code}`);
                    // console.log('result is now', result);

                    if (!code) {
                        resolve(result)
                    } else {
                        reject({
                            exit_code: code,
                        })
                    }
                }
            };

            const create_options: Dockerode.ContainerCreateOptions = {
                Tty: true,
                name: containerName,
                Labels: {
                    app: containerName,
                },
                HostConfig: {
                    AutoRemove: true,
                    Binds: [
                        `${params.folder}:/build`,
                        // '/tmp/cargo:/cargo-home',
                    ],
                },
                Env: [
                    `PACKAGE=${runtime}`,
                    'SLEEP=0.03', // this is for the srtool-dev image and will be ignored by the real srtool
                ]
            };

            this.#docker.docker.run(image, image_args, outStream, create_options, handler)
        })
    }
}

Runner.contextType = SettingsContext;
export default Runner;
