import 'mocha'
import { expect } from 'chai'
import { DockerSystemInfo } from '../src/components/dockerStatus'
import DockerWrapper from '../src/lib/dockerWrapper'

const dw = new DockerWrapper()

describe('dockerapi', () => {
	it('should get system info', async function () {
		const info: DockerSystemInfo = await dw.docker.info()
		expect(info.NCPU).greaterThan(0)
		expect(info.MemTotal).greaterThan(0)
	})

	it('should get the containers', async function () {
		const containers = await dw.docker.listContainers()
		console.log('containers', containers)
		expect(containers).is.not.null
	})

	it('should get the srtool container', async function () {
		const containers = await dw.docker.listContainers()
		const srtool = containers.find(c => c.Names.includes('/srtool'))
		console.log('srtool', srtool)
	})

	it('should ping the docker daemon', async function () {
		await dw.getDockerRunning()
	})
})
