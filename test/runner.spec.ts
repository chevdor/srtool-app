import 'mocha'
import { expect } from 'chai'
import { defaultSettings } from '../src/lib/settings'
import Runner from '../src/lib/runner'

describe('runner', () => {
	it('should get projectPath', async function () {
		const r = new Runner(defaultSettings)
		expect(r.settings.local.projectPath).to.have.length.greaterThan(5)
	})
})
