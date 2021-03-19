import { assert } from './assert'

export type GithubTag = {
	/** looks like refs/tags/v1.2.3 */
	ref: string
	node_id?: string
	url?: string
	object?: {
		sha?: string
		type?: 'commit' | 'tag'
		url?: string
	}
}

export type Tag = GithubTag
export type Service = 'github'

/**
 * A class to fetch information about the repo independantly from the
 * service (gitlab/github) used.
 * NOTE: For now, we support only github.
 */
export default class VersionControlSystem {
	private owner: string
	private repo: string
	private service: Service

	constructor(service: Service, owner: string, repo: string) {
		this.owner = owner
		this.repo = repo
		this.service = service
	}

	/**
	 * Fetch the list of tags.
	 * WARNING: it returns only the latest 30 tags.
	 */
	async getTags(): Promise<Tag[]> {
		return new Promise(async (resolve, reject) => {
			const url = `https://api.github.com/repos/${this.owner}/${this.repo}/git/matching-refs/tag`
			console.log(`Fetching tags using ${url}`)
			const response = await fetch(url, {
				method: 'get',
				headers: { 'Content-Type': 'application/json' },
			})

			if (response.status === 200) {
				const json = await response.json()
				const sorted = json.reverse().slice(0, 30)
				resolve(sorted)
			} else {
				reject(
					new Error(
						`Something went wrong fetching the tags from ${url}. Status: ${response.status}`
					)
				)
			}
		})
	}

	/**
	 * Fetch a given version from a given repo and store it as
	 * `destination`.
	 * @param tag The tag of the version to fetch. ie `v0.8.28`
	 * @param destination Destination file
	 */
	public async fetchSourceArchive(
		tag: string,
		destination: string
	): Promise<void> {
		const { owner, repo, service } = this
		assert(tag.indexOf('refs') < 0, `Invalid tag: ${tag}`)
		console.log(`Fetching tag ${tag} of ${owner}/${repo} from ${service}`)
		console.log(`The archive will be stored at ${destination}`)

		if (service !== 'github') throw new Error(`${service} not supported yet`)
		const url = `https://codeload.github.com/${owner}/${repo}/zip/${tag}`
		console.log(`Fetching tag from ${url}`)

		const { writeFile } = require('fs')
		const { promisify } = require('util')
		const writeFilePromise = promisify(writeFile)

		await fetch(url)
			.then(x => x.arrayBuffer())
			.then(x => writeFilePromise(destination, Buffer.from(x)))

		return
	}

	/**
	 * WIP: It would be better to handle the zip as a stream and unzip it
	 * right away, taking away the download and cleanup of the zip away from the runner.
	 * @param tag
	 * @param destination
	 */
	public async fetchSource(tag: string, _destination: string): Promise<void> {
		const { owner, repo, service: _service } = this
		const _outputFile = `${owner}-${repo}-${tag}.zip`
		throw new Error('Method not implemented.')
	}
}
