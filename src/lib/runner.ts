import { Result } from './result';
import { defaultSettings, Settings } from './settings';
import ChildProcess from 'child_process'
import React from 'react';
import * as Path from 'path'
import { SRToolResultBuilder } from './message';
import { Service } from './svc';
import * as fs from 'fs'
import * as util from 'util'

export type RunParams = {
    /** Those are the args for `docker run` */
    docker_run: string[],
    /** The image to be used */
    image: string,
    /** The args to pass to the image */
    image_args: string[],
}

/**
 * The Runner is the class that is doing the work of calling
 * srtool.
 */
export default class Runner extends React.Component<any, any> {

    private _settings: Settings;
    private _onDataCb: (data: string) => void;

    constructor(props?: any) {
        super(props)
        this._settings = defaultSettings; // TODO: we should be using the settings context here
        this._onDataCb = (_data: string) => { };
    }

    public set onData(cb: (data: string) => void) {
        if (!cb) throw new Error('Invalid onData callback')
        this._onDataCb = cb;
    }

    public get settings(): Settings {
        return this._settings;
    }

    /**
     * Fetch a given version from a given repo adn store it in
     * our workDir.
     * repo: https://codeload.github.com/paritytech/polkadot
     * tag: v0.8.28
     * url: https://codeload.github.com/paritytech/polkadot/zip/v0.8.28
      * @param owner 
      * @param repo 
      * @param tag 
      */
    public async fetchArchive(service: Service, owner: string, repo: string, tag: string): Promise<string> {

        console.log(`Fetching tag ${tag} of ${owner}/${repo} from ${service}`);
        if (service !== 'github') throw new Error(`${service} not supported yet`)
        const url = `https://codeload.github.com/${owner}/${repo}/zip/${tag}`;
        console.log(`Fetching from ${url}`);

        const { writeFile } = require('fs');
        const { promisify } = require('util');
        const writeFilePromise = promisify(writeFile);

        const outputFile = '/tmp/zip.zip'; // TODO: fix path

        await fetch(url)
            .then(x => x.arrayBuffer())
            .then(x => writeFilePromise(outputFile, Buffer.from(x)));

        return outputFile
    }

    public async unzip(zipfile: string): Promise<string> {
        console.log(`Unzipping ${zipfile}`);
        throw new Error("Method not implemented.");

        return '/path/of/the/unzipped/repo'
    }

    /**
     * Delete the zip archive. You should do that after unzipping
     * @param zipfile 
     */
    public async deleteZip(zipfile: string): Promise<void> {
        console.log(`Deleting zip at ${zipfile}}`);
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
     * Delete folder where we worked.
     * WARNING: Only call this in `httpGet` mode and NOT in `user` mode.
     * @param folder 
     */
    public async cleanup(folder: string) {
        console.log(`Deleting the whole folder ${folder}}`);

        throw new Error("Method not implemented.");
    }

    // @ts-ignore
    public async run(p: RunParams): Promise<void> {
        const spawn = ChildProcess.spawn;
        return new Promise((resolve, reject) => {

            console.log('Running with', this._settings);
            const timeoutDuration = this.settings.runner.watchDogDuration;
            const errors: Error[] = [];
            let lastLine: string;

            const timeoutCallback = () => {
                spawn('bash', ['-c', 'docker rm -f srtool-app-run']);
                reject(new Error(`Timeout: No activity for the last ${timeoutDuration} ms`));
            };

            let timeoutHandle = setTimeout(timeoutCallback, timeoutDuration);

            // test call, fake output
            // const cmd = 'docker run --rm --name srtool busybox sh -c "sleep 1; date; sleep 1; date; sleep 2; date; sleep 1; echo { \"x\": 42, \"test\": 23 }"';

            // replay of a real output, no docker, much faster...

            // TODO: make a test/dev container doing that
            // const replay = '/tmp/srtool-polkadot-0.8.28-nocolor.log';
            // console.log(`Using replay from ${replay}`);
            // const cmd = `awk '{print $0; system("sleep .005");}' ${replay}`

            // real call to srtool (long...) 
            // const cmd = 'docker run --rm --name srtool srtool sh -c "sleep 1; date; sleep 1; date; sleep 2; date;"';

            const cmd = `docker run ${p.docker_run.join(' ')} ${p.image} ${p.image_args.join(' ')}`
            console.log(`command: ${cmd}`);

            const s = spawn('bash', ['-c', cmd]);

            s.stdout.on("data", (data: Buffer) => {
                if (this._onDataCb) {
                    data.toString().split('\r\n')
                        .filter(line => line.length)
                        .forEach((line: string) => {
                            lastLine = line;
                            this._onDataCb(line);
                        })
                }
                clearTimeout(timeoutHandle);
                timeoutHandle = setTimeout(timeoutCallback, timeoutDuration);
            });

            s.stderr.on("data", (err: Error) => {
                console.error('Error', err.toString());

                clearTimeout(timeoutHandle);
                errors.push(err);
            });

            s.on("exit", (code: any) => {
                console.log('on exit', code);

                clearTimeout(timeoutHandle);
                if (!code) {
                    console.info(`Exit code: ${code}`);
                    resolve()
                } else {
                    // console.error(`Exit code: ${code}`);
                    reject({
                        exit_code: code,
                        errors,
                    })
                }

                spawn('bash', ['-c', 'docker rm -f srtool']);
            });
        })
    }
}
