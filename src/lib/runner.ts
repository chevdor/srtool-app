import { Result } from './result';
import { Settings } from './settings';
import ChildProcess from 'child_process'
import React from 'react';
import * as Path from 'path'

/**
 * The Runner is the class that is doing the work of calling
 * srtool.
 */
export default class Runner extends React.Component<any, any> {
    private _settings: Settings;
    private _onDataCb: (data: string) => void;

    constructor(props?: any) {
        super(props)
        this._settings = new Settings('kusama-runtime');
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
     */
    public async fetchVersion(repo: string, tag: string): Promise<void> {
        console.log(`Fecthing tag ${tag} from ${repo}`);
        const url = `${repo}/zip/${tag}`;
    }

    public async unzip(zipfile: string): Promise<void> {
        console.log(`Unzipping ${zipfile}}`);
    }

    // @ts-ignore
    public async run(): Promise<Result> {
        const spawn = ChildProcess.spawn;
        return new Promise<Result>((resolve, reject) => {

            console.log('Running with', this._settings);
            const timeoutDuration = this.settings.watchDogDuration;
            const errors: Error[] = [];

            const timeoutCallback = () => {
                spawn('bash', ['-c', 'docker rm -f srtool-app-run']);
                reject(new Error(`Timeout: No activity for the last ${timeoutDuration} ms`));
            };

            let timeoutHandle = setTimeout(timeoutCallback, timeoutDuration);

            // test call, fake output
            // const cmd = 'docker run --rm --name srtool busybox sh -c "sleep 1; date; sleep 1; date; sleep 2; date; sleep 1; echo { \"x\": 42, \"test\": 23 }"';

            // replay of a real output, no docker, much faster...

            // TODO: make a test/dev container doing that
            const replay = '/tmp/srtool-polkadot-0.8.28-nocolor.log';
            console.log(`Using replay from ${replay}`);
            const cmd = `awk '{print $0; system("sleep .01");}' ${replay}`

            // real call to srtool (long...) 
            // const cmd = 'docker run --rm --name srtool srtool sh -c "sleep 1; date; sleep 1; date; sleep 2; date;"';

            const s = spawn('bash', ['-c', cmd]);

            s.stdout.on("data", (data: Buffer) => {
                if (this._onDataCb) {
                    data.toString().split('\r\n')
                        .filter(line => line.length)
                        .forEach((line: string) => {
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
                    resolve({
                        timestamp: new Date(),
                        settings: this.settings,
                        proposalHash: 'JUNK',
                    })
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
