import React from 'react'
import Hash from './hash'
import Pre from './pre'
import { Box, Button, Typography } from '@material-ui/core'
import { SRToolResult } from '../lib/message'
import { clipboard } from 'electron'
import { resultToString } from '../lib/result'

export type Props = {
	result: SRToolResult
}

export type ExportFormat = 'text' | 'markdown' | 'json' | 'proposalHash'

class SrtoolResultComp extends React.Component<Props, never> {
	private copyResultToClipboard(
		result: SRToolResult,
		format: ExportFormat = 'text'
	): void {
		console.log('Copying result to clipboard', result)
		clipboard.writeText(resultToString(result, format))
		console.log('Result copied to clipboard')
	}

	render(): React.ReactNode {
		const { result } = this.props

		return result ? (
			<Box color="text.primary" style={{ margin: '20px' }}>
				<Button
					style={{ border: '1px solid #ff9800', marginRight: '10px' }}
					color="primary"
					onClick={() => {
						this.copyResultToClipboard(result, 'text')
					}}
				>
					Copy TXT
				</Button>
				<Button
					style={{ border: '1px solid #ff9800', marginRight: '10px' }}
					color="primary"
					onClick={() => {
						this.copyResultToClipboard(result, 'markdown')
					}}
				>
					Copy Markdown
				</Button>
				<Button
					style={{ border: '1px solid #ff9800', marginRight: '10px' }}
					color="primary"
					onClick={() => {
						this.copyResultToClipboard(result, 'json')
					}}
				>
					Copy JSON
				</Button>

				{/* TODO LATER: The following should be done within the 'Hash' component, or even for all fields ? */}
				<Button
					style={{ border: '1px solid #ff9800', marginRight: '10px' }}
					color="primary"
					onClick={() => {
						this.copyResultToClipboard(result, 'proposalHash')
					}}
				>
					Copy Prop. Hash
				</Button>
				<Box id="context">
					<Typography variant="overline" display="block">
						Context
					</Typography>

					<Typography variant="body1">gen: {result.generator}</Typography>
					<Typography variant="body1">
						commit: <Pre content={result.git.commit} />
					</Typography>
					<Typography variant="body1">branch: {result.git.branch}</Typography>
					<Typography variant="body1">tag: {result.git.tag}</Typography>
					<Typography variant="body1">package: {result.package}</Typography>
					<Typography variant="body1">rustc: {result.rustc}</Typography>
					<Typography gutterBottom />
				</Box>

				<Box id="result">
					<Typography variant="overline" display="block">
						Result
					</Typography>

					<Typography variant="body1">
						proposal hash: <Hash content={result.proposalHash} />
					</Typography>
					<Typography variant="body1">size: {result.size} bytes</Typography>
					<Typography variant="body1">
						time: {result.time.toString()}
					</Typography>
					{/* <Typography variant="body1">duration: {`${result.duration}ms`}</Typography> */}
					<Typography variant="body1">
						sha256: <Hash content={result.sha256} />
					</Typography>
					<Typography variant="body1">wasm path: {result.wasm.path}</Typography>
					<Typography gutterBottom />
				</Box>
			</Box>
		) : null
	}
}

export default SrtoolResultComp
