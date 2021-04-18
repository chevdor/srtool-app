import { Box, Typography } from '@material-ui/core'
import React from 'react'
import Troubleshoot from './troubleshoot'
import pkg from '../../package.json'

const fixed: "fixed" = "fixed";
const FooterStyle = {
	bottom: 0,
	position: fixed,
    width: '100%',
	background: '#424242',
	padding: '0px 10px 0px 10px',
	marginBottom: '2px',
}

type State = {
	debug: boolean
}

type Props = {}

export default class Footer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = {
			debug: false,
		}
	}

	toggleDebug = (): void => {
		this.setState({ debug: !this.state.debug })
	}

	render(): React.ReactNode {
		return (
			<div>
				<Box color="text.primary" className="footer" style={FooterStyle}>
					<Typography
						variant="caption"
						onDoubleClick={this.toggleDebug}
						style={{ userSelect: 'none' }}
					>
						{`${pkg.name} v${pkg.version} by ${pkg.author}`}
					</Typography>
				</Box>
				<div id="debug" hidden={!this.state.debug}>
					<Troubleshoot />
				</div>
			</div>
		)
	}
}
