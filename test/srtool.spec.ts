import { expect } from 'chai'
import Srtool from '../src/lib/srtool'
import 'mocha'

const srtool = new Srtool()

describe('srtool', () => {
	it('should get the latest version', async function () {
		const version = await srtool.getSrtoolLatestVersion()
		expect(version).to.equal('0.9.10')
	})
})
