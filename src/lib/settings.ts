import os from 'os';

export type KnownRuntime = 'kusama-runtime' | 'polkadot-runtime'; 
export type Package = KnownRuntime;

/**
 * User Settings
 */
export class Settings {
    private _package: Package;
    private _workDir: string;
    private _watchDogDuration: number;

    constructor(p: Package) {
        this._package = p;
        this._workDir = os.tmpdir();
        this._watchDogDuration = 60000;
    }

    public get package() : Package {
        return this._package;
    }

    public set package(v : Package) {
        this._package = v;
    }

    public get workDir() : string {
        return this._workDir;
    }

    public get watchDogDuration() : number {
        return this._watchDogDuration;
    }
}
