import React from 'react';
import ChildProcess from 'child_process'
import * as fs from 'fs'
import unzipper from 'unzipper'
import { assert } from 'console';
import { defaultSettings, Settings } from './settings';
import VersionControlSystem, { Service } from './vcs';
import del from 'del';
import DockerWrapper from './dockerWrapper';
import Dockerode from 'dockerode';

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
    #settings: Settings;
    #onDataCb: (data: string) => void;
    #docker: DockerWrapper;

    constructor(props?: any) {
        super(props)
        this.#settings = defaultSettings; // TODO: we should be using the settings context here
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
        const destination = `/tmp/${owner}-${repo}-${tag}.zip`; // TODO: move to workdir
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
        // const vcs = new VersionControlSystem(service, owner, repo);
        // const destination = `/tmp/`; // TODO: move to workdir
        // await vcs.fetchSource(tag, destination)
        // return destination

        const zip = await this.fetchArchive(service, owner, repo, tag);
        console.log("zip located at", zip);

        console.log('Unzipping');
        await this.unzip(zip, workdir);
        console.log('Unzipping done');

        const folder = `${workdir}/${repo}-${tag.replace("v", "")}`; // TODO: meh....
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
        // TODO: Implement that
        const docker = this.#docker.docker;

        const containers = await docker.listContainers({ name: 'srtool' });
        if (containers.length) {
            console.log('Found old srtool container(s), cleaning up');
            containers.forEach(async (containerInfo: Dockerode.ContainerInfo) => {
                console.log(` - Dealing with ${containerInfo.Names.toString()} (${containerInfo.Id} from ${containerInfo.Image})`);
                const container = docker.getContainer(containerInfo.Id)
                // all of our containers start with --rm so it *should* be enough
                await container.stop()
                // however, the user may start srtool manually...
                try {
                    await container.remove()
                } catch (_e) { }
            })
        }
        console.log('Done preparing');
    }

    // @ts-ignore
    public async run(p: RunParams): Promise<void> {
        const spawn = ChildProcess.spawn;
        return new Promise((resolve, reject) => {

            console.log('Running with', this.#settings);
            const errors: Error[] = [];
            let lastLine: string;

            // test call, fake output
            // const cmd = 'docker run --rm --name srtool busybox sh -c "sleep 1; date; sleep 1; date; sleep 2; date; sleep 1; echo { \"x\": 42, \"test\": 23 }"';

            // replay of a real output, no docker, much faster...

            // TODO: make a test/dev container doing that
            // const replay = '/tmp/srtool-polkadot-0.8.28-nocolor.log';
            // console.log(`Using replay from ${replay}`);
            // const cmd = `awk '{print $0; system("sleep .005");}' ${replay}`

            // real call to srtool (long...) 
            // const cmd = 'docker run --rm --name srtool srtool sh -c "sleep 1; date; sleep 1; date; sleep 2; date;"';

            const cmd = `docker run --rm ${p.docker_run.join(' ')} ${p.image} ${p.image_args.join(' ')}`
            console.log(`command: ${cmd}`);

            const s = spawn('bash', ['-c', cmd]);

            s.stdout.on("data", (data: Buffer) => {
                if (this.#onDataCb) {
                    data.toString().split('\r\n')
                        .filter(line => line.length)
                        .forEach((line: string) => {
                            lastLine = line;
                            this.#onDataCb(line);
                        })
                }
            });

            // Output on stderr, is not (yet) an error for us and we want to
            // catch it to show it in our console. 
            s.stderr.on("data", (data: Buffer) => {
                if (this.#onDataCb) {
                    data.toString().split('\r\n')
                        .filter(line => line.length)
                        .forEach((line: string) => {
                            lastLine = line;
                            this.#onDataCb('|' + line);
                        })
                }
            });

            s.on("exit", (code: any) => {
                console.log('on exit', code);

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
