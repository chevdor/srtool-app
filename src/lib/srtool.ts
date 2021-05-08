import { Writable } from 'stream'
import Dockerode from 'dockerode'
import DockerWrapper from './dockerWrapper'

export type SrtoolVersions = {
	name: string
	version: string
	rustc: string
}

/**
 * This class fetches and communicates with the srtool container
 * and provides useful information from the repo such as the latest
 * version available.
 */
export default class Srtool {
	#docker: DockerWrapper

	constructor() {
		this.#docker = new DockerWrapper()
	}

	/**
	 * Fetch the current of the Srtool APP from the package.json.
	 */
	async getSrtoolAppCurrentVersion(): Promise<string> {
		return new Promise(resolve => {
			const pkg = require('../../package.json')
			resolve(pkg.version)
		})
	}

	/**
	 * Fetch the latest known version of the Srtool APP from the repo.
	 */
	// TODO LATER: we may consider using TAGs instead of the package.json
	async getSrtoolAppLatestVersion(): Promise<string> {
		return new Promise(async (resolve, reject) => {
			const repo = 'https://gitlab.com/chevdor/srtool-app'
			const response = await fetch(`${repo}/-/raw/master/package.json`)
			if (response.status == 200) {
				const pkgJson = await response.text()
				const pkg = JSON.parse(pkgJson)
				console.log(`SrtoolApp Latest Version: ${pkg.version}`)

				resolve(pkg.version)
			} else {
				reject(
					new Error(
						`Something went wrong in getSrtoolAppLatestVersion. http status = ${response.status}`
					)
				)
			}
		})
	}

	/**
	 * Fetch the latest version of srtool (docker, not the App) from the repo.
	 * This is actually the version of the build script inside the docker image.
	 */
	async getSrtoolLatestVersion(): Promise<string> {
		const repo = 'https://gitlab.com/chevdor/srtool'
		const response = await fetch(`${repo}/-/raw/master/VERSION`)

		if (response.status == 200) {
			const version = await response.text()
			return version.trimEnd()
		} else {
			throw new Error(
				`Something went wrong in getSrtoolAppLatestVersion. http status = ${response.status}`
			)
		}
	}

	/**
	 * Calling this ensures we do have the expected `tag` version of the image or pulls it.
	 * It also runs the `version` command and returns the result.
	 * @param tag Expected version
	 */
	async getImage(tag: string): Promise<void> {
		const image = `chevdor/srtool${tag ? ':' + tag : ''}`
		console.info(`Getting image: ${image}`)

		return new Promise(async (resolve, _reject) => {
			const docker = this.#docker.docker
			// const StringDecoder = require('string_decoder').StringDecoder
			// const _decoder = new StringDecoder()
			// let _output = ''
			console.log('pulling')

			docker.pull(image, (err: any, stream: any) => {
				if (err) console.error(err)
				if (stream) console.log('stream', stream)

				function onFinished(err: any, output: any): void {
					if (err) console.error(err)
					console.log('on Finished', output)
					resolve()
				}

				function onProgress(event: any): void {
					console.log('onProgress', event)
				}

				docker.modem.followProgress(stream, onFinished, onProgress)
			})
		})
	}

	/**
	 * Get the current version of srtool while calling:
	 * `srtool version` on the current image.
	 */
	async getSrtoolCurrentVersions(image: string): Promise<SrtoolVersions> {
		// const containerName = 'srtool-version'

		return new Promise((resolve, reject) => {
			const version_cmd = ['version', '-cM']
			console.log(`checking version for ${image}`)

			const outStream = new Writable()
			const StringDecoder = require('string_decoder').StringDecoder
			const decoder = new StringDecoder()
			let output = ''

			outStream._write = function write(
				doc: any,
				encoding: any,
				next: () => void
			) {
				let result = decoder.write(doc)
				output += result
				next()
			}

			const handler = (error: any, _data: any, _container: any): void => {
				if (error) {
					reject(error)
				} else {
					try {
						const info: SrtoolVersions = JSON.parse(output)
						resolve(info)
					} catch (e) {
						console.warn(
							`Failed parsing json output from 'docker run ${image} ${version_cmd.join(
								' '
							)}'. You are likely running an image that is too old.`
						)
						resolve({
							name: 'srtool',
							version: '0.9.0',
							rustc: 'nightly-2021-02-25',
						})
					}
				}
			}
			const create_options: Dockerode.ContainerCreateOptions = {
				Tty: true,
				Labels: {
					app: 'srtool',
				},
				HostConfig: {
					AutoRemove: true,
				},
			}

			console.log(
				'Starting container to check the version',
				image,
				version_cmd,
				create_options
			)

			this.#docker.docker.run(
				image,
				version_cmd,
				outStream,
				create_options,
				handler
			)
		})
	}

	/**
	 * Fetch the latest version of the docker image for srtool from the repo.
	 * This is the docker image tag and this is also the rustc version.
	 */
	async getSrtoolRustcLatestVersion(): Promise<string> {
		const repo = 'https://gitlab.com/chevdor/srtool'
		const url = `${repo}/-/raw/master/RUSTC_VERSION`
		console.log(`Getting latest image tag from ${url}`)

		const response = await fetch(url)
		if (response.status == 200) {
			const version = await response.text()
			return version
		} else {
			throw new Error(
				`Something went wrong in getSrtoolAppLatestVersion. http status = ${response.status}`
			)
		}
	}

	/**
	 * This is: docker rm -f srtool
	 */
	async removeContainer(): Promise<void> {
		const container = await this.#docker.getContainer()
		await container?.remove({ force: true })
	}

	/**
	 * This removes all srtool images.
	 */
	async removeImages(): Promise<void> {
		return this.#docker.deleteImages('srtool')
	}
}
