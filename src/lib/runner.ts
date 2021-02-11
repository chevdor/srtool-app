import { Result } from './result';
import { Settings } from './settings';

/**
 * The Runner is the class that is doing the work of calling
 * srtool.
 */
export class Runner {
    private _settings: Settings;
    // private _onData?: Fn = null;

    constructor() {
        this._settings = new Settings('kusama-runtime');
    }

    public get settings(): Settings {
        return this._settings;
    }

    // @ts-ignore
    // public async run(): Promise<Result> { 
    public run(): Result { 
        console.log('Running with', this._settings);
        let spawn = require("child_process").spawn;
        
        const cmd = 'docker run --rm busybox sh -c "sleep 2; date"';
        const s = spawn('bash', ['-c', cmd]);

        s.stdout.on("data", (data: any) => {
            console.log(data.toString());
        });

        s.stderr.on("data", (err: any) => {
            console.log(err.toString());

            return new Promise<Result>((_, reject) => {
                reject({
                    error: err,
                })
            });

        });

        s.on("exit", (code: any) => {
            console.log(code);

            // return new Promise<number>((resolve) => {
            //     resolve(4);
            // });

            return new Promise<Result>((resolve) => {
                resolve({
                    timestamp: new Date(),
                    settings: this.settings,
                    proposalHash: 'JUNK',
                })
            });
        });
    }

    // public onData(cb: Fn)
}