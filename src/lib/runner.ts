import React from 'react';
import * as fs from 'fs'
import unzipper from 'unzipper'
import { assert } from 'console';
import { defaultSettings, Settings, SettingsContextContent } from './settings';
import VersionControlSystem, { Service } from './vcs';
import DockerWrapper from './dockerWrapper';
import Dockerode from 'dockerode';
import { Writable } from 'stream';
import { isResult, SRToolOutput, SRToolResult } from './message';
import { RunnerConfig } from '../components/runnerConfig';
import SettingsContext from '../contexts/settingsContext';
import { containerName } from '../constants';

/**
 * The Runner is the class that is doing the work of calling
 * srtool.
 */
class Runner extends React.Component<any, any> {
    #settings: Settings;
    #onDataCb: (data: string) => void;
    #docker: DockerWrapper;

    constructor(props?: any) {
        super(props)
        this.#settings = defaultSettings; // TODO NOW: we should be using the settings context here
        this.#onDataCb = (_data: string) => { };
        this.#docker = new DockerWrapper();
    }

    public set onData(cb: (data: string) => void) {
        if (!cb) throw new Error('Invalid onData callback')
        this.#onDataCb = cb;
    }

    public get settings(): Settings {
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
        const destination = `/tmp/${owner}-${repo}-${tag}.zip`; // TODO WORKDIR: move to workdir
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
        assert(folder.indexOf('/tmp') === 0, 'Trying to delete outside of /tmp ?');
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
    public async run(params: RunnerConfig): Promise<SRToolOutput> {
        console.log('Running srtool using', params);
        const settings: SettingsContextContent = this.context;  
        console.log('Settings', settings);

        const { image, package: runtime } = params;
        const image_args = ['build', '--app']; // --app is critical! 

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

                        if (isResult(lastLine)) {
                            const result: SRToolOutput = JSON.parse(lastLine)
                            resolve(result)
                        }
                    })
                next()
            };

            const handler = (error: any, data: any, container: any) => {
                if (error) {
                    reject(error)
                } else {
                    // console.log('handler data', data);
                    const { StatusCode: code } = data;

                    if (!data.StatusCode) {
                        console.info(`Exit code: ${code}`);

                    } else {
                        reject({
                            exit_code: code,
                        })
                    }
                }
            };

            const projectPath = settings.local.projectPath;
            const create_options: Dockerode.ContainerCreateOptions = {
                Tty: true,
                name: containerName,
                Labels: {
                    app: containerName,
                },
                HostConfig: {
                    AutoRemove: true,
                    Binds: [
                        `${projectPath}:/build`, // FIXME WORKDIR: /tmp/srtool/polkadot-0.8.28 should not be hard coded
                        // '/tmp/cargo:/cargo-home',
                    ],
                },
                Env: [
                    `PACKAGE=${runtime}`, // FIXME NOW: use value from the settings / user selection 
                    'SLEEP=0.03', // this is for the srtool-dev image and will be ignored by the real srtool
                ]
            };

            this.#docker.docker.run(image, image_args, outStream, create_options, handler)
        })
    }
}

Runner.contextType = SettingsContext;
export default Runner;
