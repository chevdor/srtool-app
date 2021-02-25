import { spawn } from 'child_process'

// TODO: replace cli calls by https://github.com/apocas/dockerode

/**
 * Returns the docker version that we found, or null.
 */
export async function getDockerVersion(): Promise<string | null> {
    let version: string | null = null;

    return new Promise((resolve, reject) => {
        let docker_version = spawn("bash", ["-c", "docker version -f json"]);

        docker_version.stdout.on("data", (data: Buffer) => {
            // TODO: remove the following hack once https://github.com/docker/cli/issues/2981 is fixed
            const json = JSON.parse(data.toString().split("\n")[0]);
            // const json = JSON.parse(data.toString());

            version = json.Client.Version;
        });

        docker_version.stderr.on("data", (err: Error) => reject);

        docker_version.on("exit", (code: any) => {
            if (!code) {
                resolve(version);
            } else {
                reject(`Call returned error: ${code}`);
            }
        });
    });
}

/**
 * Check whether the docker daemon is running or not
 */
export async function getDockerRunning(): Promise<boolean> {
    let running = false;

    return new Promise((resolve, reject) => {
        let docker_version = spawn("bash", [
            "-c",
            "docker info --format '{{json .}}'",
        ]);

        docker_version.stdout.on("data", (data: Buffer) => {
            const json = JSON.parse(data.toString());
            running = json.ServerErrors == null || json.ServerErrors.length === 0;
        });

        docker_version.stderr.on("data", (err: Error) => reject);

        docker_version.on("exit", (code: any) => {
            if (!code) {
                console.log(`Docker running: ${running.toString()}`);
                
                resolve(running);
            } else {
                reject(`Call returned error: ${code}`);
            }
        });
    });
}