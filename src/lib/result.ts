import { ExportFormat } from '../components/result'
import { SRToolResult } from './message'
import { Settings } from './settings'

export type Result = {
	settings: Settings
	result: SRToolResult
	timestamp: Date
}

export function resultToString(
	r: SRToolResult,
	format: ExportFormat = 'text'
): string {
	let res = ''

	switch (format) {
		case 'json':
			res = JSON.stringify(r, null, 2)
			break
		case 'proposalHash':
			res = r.proposalHash
			break
		case 'markdown':
			res +=
				'I ran `srtool` to generate and verify a substrate runtime and there is my result:\n'
			res += `- generator: \`${r.generator}\`\n`
			res += '- git:\n'
			res += `  - commit: \`${r.git.commit}\`\n`
			res += `  - tag: \`${r.git.tag}\`\n`
			res += `  - branch: \`${r.git.branch}\`\n`
			res += `- package: \`${r.package}\`\n`
			res += `- rustc: \`${r.rustc}\`\n`
			// res += `- duration: \`${r.duration}\`\n`;
			res += `- proposalHash: \`${r.proposalHash}\`\n`
			res += `- sha256: \`${r.sha256}\`\n`
			res += `- size: \`${r.size}\`\n`
			res += `- time: \`${r.time}\`\n`
			break
		case 'text':
			res +=
				'I ran srtool to generate and verify a substrate runtime and there is my result:\n'
			res += `- generator: ${r.generator}\n`
			res += '- git:\n'
			res += `  - commit: ${r.git.commit}\n`
			res += `  - tag: ${r.git.tag}\n`
			res += `  - branch: ${r.git.branch}\n`
			res += `- package: ${r.package}\n`
			res += `- rustc: ${r.rustc}\n`
			// res += `- duration: ${r.duration}\n`;
			res += `- proposalHash: ${r.proposalHash}\n`
			res += `- sha256: ${r.sha256}\n`
			res += `- size: ${r.size}\n`
			res += `- time: ${r.time}\n`
			break
		default:
			throw new Error(`Format ${format} is not supported`)
	}
	return res
}
