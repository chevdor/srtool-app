import Docker, { Container, DockerVersion } from 'dockerode'

/**
 * This class wraps the Docker API.
 */
export default class DockerWrapper {
	#docker: Docker

	/** Docker API wrapper */
	constructor() {
		const isWindows = process.platform === 'win32'
		let options = isWindows
			? { host: '127.0.0.1', port: 2375 }
			: { socketPath: '/var/run/docker.sock' }
		this.#docker = new Docker(options)
	}

	public get docker(): Docker {
		return this.#docker
	}

	/**
	 * Return the name of the srtool container.
	 * Usually simply 'srtool'.
	 */
	public get containerName(): string {
		return 'srtool'
	}

	/**
	 * Return the srtool container if we can find it
	 * @returns
	 */
	public async getContainer(): Promise<Container | null> {
		const opts = {
			limit: 1,
			filters: { name: [this.containerName] },
		}

		const containers = await this.#docker.listContainers(opts)

		if (containers.length) {
			return this.#docker.getContainer(containers[0].Id)
		}
		return null
	}

	public async deleteImages(name: string): Promise<void> {
		const images = await this.#docker.listImages({})
		console.log(`Found ${images.length} image(s)`)

		images
			.filter(img => img.RepoTags.filter(tag => tag.indexOf(name) >= 0).length)
			.forEach(async img => {
				console.log(`Deleting image ${img.RepoTags}`)
				console.log(img)
				const i = this.#docker.getImage(img.RepoTags[0])
				i.remove({ force: true })
			})
	}

	/**
	 * Returns the detected Docker version.
	 * We use that to check whether or not Docker is installed at all.
	 * @returns
	 */
	async getDockerVersion(): Promise<string | null> {
		let version: DockerVersion = await this.docker.version()
		return version.Version
	}

	/**
	 * Docker may be installed but not currently running. This function checks that it does.
	 * @returns
	 */
	async getDockerRunning(): Promise<boolean> {
		try {
			const response: Buffer = await this.docker.ping()
			return response.toString() === 'OK'
		} catch (e) {
			return false
		}
	}

	// TODO LATER: add and call function to list current images and containers. This should be done at startup to have it in the logs and troubleshoot potential issues.
	// TODO LATER: Another option is to provide a create log button that generates a report including the info above.
}
