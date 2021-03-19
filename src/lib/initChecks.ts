import checkDiskSpace from 'check-disk-space'
import DockerWrapper from './dockerWrapper'
import { Settings } from './settings'
import Srtool from './srtool'

export enum CheckStatus {
	OK,
	WARNING,
	ERROR,
}

export type CheckResult = {
	status: CheckStatus
	value?: any
	message?: string
}

type AsyncCheckResult = Promise<CheckResult>

/**
 * This class hosts a bunch of checks that are there to ensure that
 * srtool will be able to run.
 */
export default class InitCheck {
	#docker: DockerWrapper
	#srtool: Srtool
	#settings: Settings

	constructor(settings: Settings) {
		this.#docker = new DockerWrapper()
		this.#srtool = new Srtool()
		this.#settings = settings
	}

	/**
	 * Check whether or not the remaining disk space may become an issue.
	 * @param dir
	 */
	public static async diskSpace(dir: string): AsyncCheckResult {
		const minFolderSize = 20 * 1e9 // 11Go currently...
		return new Promise(async (resolve, _reject) => {
			const diskSpaceResult = await checkDiskSpace(dir)
			const free = (diskSpaceResult.free * 1e-9).toFixed(2)
			const total = (diskSpaceResult.size * 1e-9).toFixed(2)
			const min = (minFolderSize * 1e-9).toFixed(2)

			console.log(
				`free disk space on the disk hosting our workDir ${dir} is ${free} / ${total} Go`
			)

			if (diskSpaceResult.free > minFolderSize) {
				resolve({
					status: CheckStatus.OK,
					value: free,
					message: `Free disk is ok: ${free}/${total}Go and we need ${min}Go`,
				})
			} else {
				resolve({
					status: CheckStatus.ERROR,
					value: free,
					message: `Free disk size may be tight: ${free}/${total}Go and we need ${min}Go`,
				})
			}
		})
	}

	/**
	 * Check if docker is installed by trying to find the installed version.
	 */
	public async dockerVersion(): AsyncCheckResult {
		return new Promise(async (resolve, _reject) => {
			const version = await this.#docker.getDockerVersion()
			if (version) {
				resolve({
					status: CheckStatus.OK,
					value: version,
					message: `Found version ${version}`,
				})
			} else {
				resolve({
					status: CheckStatus.ERROR,
					message: 'No docker version found',
				})
			}
		})
	}

	/**
	 * Check if docker is running and reachable.
	 */
	public async dockerRunning(): AsyncCheckResult {
		return new Promise(async (resolve, _reject) => {
			let running = false

			try {
				running = await this.#docker.getDockerRunning()
			} catch (e) {
				console.error(e)
			}

			if (running) {
				resolve({
					status: CheckStatus.OK,
					value: running,
					message: 'Docker seems to be running',
				})
			} else {
				resolve({
					status: CheckStatus.ERROR,
					value: running,
					message: 'The Docker daemon does not seem to be running',
				})
			}
		})
	}

	/**
	 * Check the latest srtool version from the repo.
	 * This will typically return something like `nightly-2021-02-25`.
	 */
	public async srtoolLatestImage(): AsyncCheckResult {
		return new Promise(async (resolve, _reject) => {
			const latestImage = await this.#srtool.getSrtoolRustcLatestVersion()

			if (latestImage) {
				resolve({
					status: CheckStatus.OK,
					value: latestImage,
					message: `Latest srtool image: ${latestImage}`,
				})
			} else {
				resolve({
					status: CheckStatus.ERROR,
					message: 'Something went wrong while getting the latest image',
				})
			}
		})
	}

	/**
	 * Check the latest srtool version from the repo.
	 * This will typically return something like `nightly-2021-02-25`.
	 */
	public async srtoolLatestversion(): AsyncCheckResult {
		const latestVersion = await this.#srtool.getSrtoolLatestVersion()

		if (latestVersion) {
			return {
				status: CheckStatus.OK,
				value: latestVersion,
				message: `Latest srtool version: ${latestVersion}`,
			}
		} else {
			return {
				status: CheckStatus.ERROR,
				message: 'Something went wrong while getting the latest version',
			}
		}
	}

	/**
	 * Check the srtool versions by querying `srtool version`.
	 * This returns both the image version (=rustc) as well as the srtool version (=script) itself.
	 */
	async srtoolVersions(): AsyncCheckResult {
		const versions = await this.#srtool.getSrtoolCurrentVersions(
			this.#settings.srtool.image
		)

		if (versions) {
			return {
				status: CheckStatus.OK,
				value: versions,
				message: `srtool version: ${JSON.stringify(versions)}`,
			}
		} else {
			return {
				status: CheckStatus.ERROR,
				message: 'Something went wrong while getting the srtool version',
			}
		}
	}
}
