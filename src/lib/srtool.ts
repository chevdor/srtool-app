import { spawn } from 'child_process'

// TODO: replace cli calls by https://github.com/apocas/dockerode


/**
 * Fetch the current of the Srtool APP from the package.json.
 */
export async function getSrtoolAppCurrentVersion(): Promise<string> {
    return new Promise((resolve) => {
        const pkg = require("../../package.json");
        resolve(pkg.version)
    })
}

/**
 * Fetch the latest known version of the Srtool APP from the repo.
 */
export async function getSrtoolAppLatestVersion(): Promise<string> {
    return new Promise(async (resolve, reject) => {
        const repo = "https://gitlab.com/chevdor/confmgr"; // TODO: fix this repo to srtool-app
        const response = await fetch(`${repo}/-/raw/master/package.json`);
        if (response.status == 200) {
            const pkgJson = await response.text();
            // const pkg = JSON.parse(pkgJson);
            // resolve(pkg.version)
            resolve("0.1.0") // TODO: stop returning a fake version once the repo is up
        } else {
            reject(new Error(`Something went wrong in getSrtoolAppLatestVersion. http status = ${response.status}`))
        }
    })
}


/**
 * Fetch the latest version of srtool (docker, not the App) from the repo.
 * This is actually the version of the build script inside the docker image.
 */
export async function getSrtoolLatestVersion(): Promise<string> {
    return new Promise(async (resolve, reject) => {
        const repo = "https://gitlab.com/chevdor/srtool";
        const response = await fetch(`${repo}/-/raw/master/VERSION`);
        if (response.status == 200) {
            const version = await response.text();
            resolve(version)
        } else {
            reject(new Error(`Something went wrong in getSrtoolAppLatestVersion. http status = ${response.status}`))
        }
    })
}

export type SrtoolVersions = {
    name: string;
    version: string;
    rustc: string
}


/**
 * Calling this ensures we do have the expected `tag` version of the image or pulls it.
 * It also runs the `version` command and returns the result.
 * @param tag Expected version
 */
export async function getImage(tag: string): Promise<void> {
    const image = `chevdor/srtool${tag ? ':' + tag : ''}`
    console.log(`Getting image: ${image}`);

    return new Promise((resolve, reject) => {
        let cmd = spawn("bash", ["-c", `docker pull -q ${image}`]);

        cmd.stdout.on("data", (data: Buffer) => {
            // TODO: remove the following hack once https://github.com/docker/cli/issues/2981 is fixed
            // const txt = data.toString().split("\n")[0];
        });

        cmd.stderr.on("data", (err: Error) => reject);

        cmd.on("exit", (code: any) => {
            if (!code) {
                console.log(`Done getting ${image}`);
                resolve();
            } else {
                reject(`Call returned error: ${code}`);
            }
        });
    });
}

/**
 * Get the current version of srtool while calling:
 * `srtool version`
 */
export async function getSrtoolCurrentVersions(tag: string): Promise<SrtoolVersions> {
    let info: SrtoolVersions;

    return new Promise((resolve, reject) => {
        let cmd = spawn("bash", ["-c", "docker version -f json"]); // TODO: fix that

        cmd.stdout.on("data", (data: Buffer) => {
            // TODO: remove the following hack once https://github.com/docker/cli/issues/2981 is fixed
            info = JSON.parse(data.toString().split("\n")[0]);
            // info = JSON.parse(data.toString());
        });

        cmd.stderr.on("data", (err: Error) => reject);

        cmd.on("exit", (code: any) => {
            if (!code) {
                resolve(info);
            } else {
                reject(`Call returned error: ${code}`);
            }
        });
    });
}

/**
 * Fetch the latest version of the docker image for srtool from the repo.
 * This is the docker image tag and this is also the rustc version.
 */
export async function getSrtoolRustcLatestVersion(): Promise<string> {
    const repo = "https://gitlab.com/chevdor/srtool";
    const url = `${repo}/-/raw/master/RUSTC_VERSION`;
    console.log(`Getting latest image tag from ${url}`);

    return new Promise(async (resolve, reject) => {
        const response = await fetch(url);
        if (response.status == 200) {
            const version = await response.text();
            resolve(version)
        } else {
            reject(new Error(`Something went wrong in getSrtoolAppLatestVersion. http status = ${response.status}`))
        }
    })
}
