import { expect } from 'chai'
import { isResult, Message, MessageBuilder } from '../src/lib/message'
import 'mocha'

const srtool_valid = {
	gen: 'srtool v0.9.5',
	commit: '371681c298eb96b74ad04a09ca8097f19c777e68',
	tag: 'v0.8.28',
	branch: 'heads/v0.8.28',
	tmsp: '2021-02-24T11:02:36Z',
	rustc: 'rustc 1.49.0-nightly (fd542592f 2020-10-26)',
	size: '2151335',
	pkg: 'polkadot-runtime',
	prop: '0x8e2a831f00c994558f75a7a4ef1d71d173a87365079280952ec2a4b56a36275b',
	sha256: '887c755518ead3af05e95d0db16473e26a4bdcfd9ca4d45db88144bd10db26c1',
	wasm:
		'./target/srtool/release/wbuild/polkadot-runtime/polkadot_runtime.compact.wasm',
}

const srtool_invalid = {
	gen: 'srtool v0.9.5',
	commit: '371681c298eb96b74ad04a09ca8097f19c777e68',
	tag: 'v0.8.28',
	branch: 'heads/v0.8.28',
	tmsp: '2021-02-24T11:02:36Z',
	rustc: 'rustc 1.49.0-nightly (fd542592f 2020-10-26)',
	pkg: 'polkadot-runtime',
}

describe('builder', () => {
	it('should build messages', async function () {
		expect(MessageBuilder.build('foobar').content).to.be.a('string')
		expect(MessageBuilder.build('{ "a": 42 }').content).to.be.a('object')
	})

	it('should build messages from valid srtool output', async function () {
		expect(MessageBuilder.build(JSON.stringify(srtool_valid)).content).to.be.a(
			'object'
		)
	})

	it('should build messages from invalid srtool output', async function () {
		expect(
			MessageBuilder.build(JSON.stringify(srtool_invalid)).content
		).to.be.a('object')
	})

	it('should see that this is not a result', async function () {
		const s = 'foobar'
		const m: Message = MessageBuilder.build(s)
		expect(isResult(m.content)).equal(false)
	})

	it('should see that this *is*  a result', async function () {
		const m = MessageBuilder.build(JSON.stringify(srtool_valid))
		expect(isResult(m.content)).equal(true)
	})
})
