import checkDiskSpace from "check-disk-space";
import { getDockerRunning, getDockerVersion, getDockerVersion2 } from "./docker";
import { getSrtoolCurrentVersions, getSrtoolLatestVersion, getSrtoolRustcLatestVersion } from "./srtool";

export enum CheckStatus {
    OK,
    WARNING,
    ERROR,
}

export type CheckResult = {
    status: CheckStatus;
    value?: any;
    message?: string;
}

type AsyncCheckResult = Promise<CheckResult>;

/**
 * This class hosts a bunch of checks that are there to ensure that
 * srtool will be able to run.
 */
export default class InitCheck {

    /**
     * Check whether or not the remaining disk space may become an issue.
     * @param dir 
     */
    public static async diskSpace(dir: string): AsyncCheckResult {
        const minFolderSize = 20 * 1e9; // 11Go currently...
        return new Promise(async (resolve, _reject) => {
            const diskSpaceResult = await checkDiskSpace(dir);
            const free = (diskSpaceResult.free * 1e-9).toFixed(2);
            const total = (diskSpaceResult.size * 1e-9).toFixed(2);
            const min = (minFolderSize * 1e-9).toFixed(2);

            console.log(`free disk space on the disk hosting ${dir} is ${free} / ${total} Go`);

            if (diskSpaceResult.free > minFolderSize) {
                resolve({ status: CheckStatus.OK, value: free, message: `Free disk is ok: ${free}/${total}Go and we need ${min}Go` })
            }
            else {
                resolve({ status: CheckStatus.ERROR, value: free, message: `Free disk size may be tight: ${free}/${total}Go and we need ${min}Go` })
            }
        })
    }

    /**
     * Check if docker is installed by trying to find the installed version.
     */
    public static async dockerVersion(): AsyncCheckResult {
        return new Promise(async (resolve, reject) => {
            const version = await getDockerVersion2();
            if (version) {
                resolve({ status: CheckStatus.OK, value: version, message: `Found version ${version}` })
            } else {
                resolve({ status: CheckStatus.ERROR, message: `No docker version found` })
            }
        })
    }

    /**
     * Check if docker is running and reachable.
     */
    public static async dockerRunning(): AsyncCheckResult {
        return new Promise(async (resolve, reject) => {
            let running = false;

            try {
                running = await getDockerRunning()
            } catch (e) {
                console.error(e);
            }

            if (running) {
                resolve({ status: CheckStatus.OK, value: running, message: `Docker seems to be running` })
            } else {
                resolve({ status: CheckStatus.ERROR, value: running, message: `The Docker daemon does not seem to be running` })
            }
        })
    }

    /**
    * Check the latest srtool version from the repo.
    * This will typically return something like `nightly-2021-02-25`.
    */
    public static async srtoolLatestImage(): AsyncCheckResult {
        return new Promise(async (resolve, reject) => {
            const latestImage = await getSrtoolRustcLatestVersion();

            if (latestImage) {
                resolve({ status: CheckStatus.OK, value: latestImage, message: `Latest srtool image: ${latestImage}` })
            } else {
                resolve({ status: CheckStatus.ERROR, message: `Something went wrong while getting the latest image` })
            }
        })
    }


/**
    * Check the latest srtool version from the repo.
    * This will typically return something like `nightly-2021-02-25`.
    */
   public static async srtoolLatestversion(): AsyncCheckResult {
    return new Promise(async (resolve, reject) => {
        const latestVersion = await getSrtoolLatestVersion();

        if (latestVersion) {
            resolve({ status: CheckStatus.OK, value: latestVersion, message: `Latest srtool version: ${latestVersion}` })
        } else {
            resolve({ status: CheckStatus.ERROR, message: `Something went wrong while getting the latest version` })
        }
    })
}

    /**
     * Check the srtool versions by querying `srtool version`.
     * This returns both the image version (=rustc) as well as the srtool version (=script) itself.
     */
    public static async srtoolVersions(): AsyncCheckResult {
        return new Promise(async (resolve, reject) => {
            const versions = await getSrtoolCurrentVersions('nightly-2021-02-25'); // TODO: fixme, it should not be hardcoded

            if (versions) {
                resolve({ status: CheckStatus.OK, value: versions, message: `srtool version: ${JSON.stringify(versions)}` })
            } else {
                resolve({ status: CheckStatus.ERROR, message: `Something went wrong while getting the srtool version` })
            }
        })
    }
}