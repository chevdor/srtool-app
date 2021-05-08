import React from 'react'
import StatusContext from '../contexts/statusContext'
import { Box, Typography } from '@material-ui/core'

/**
 * This component show various versions
 */
class Status extends React.Component {
	render(): React.ReactNode {
		// let { context } = this

		return (
			<StatusContext.Consumer>
				{(context: any) => {
					return (
						<Box id="status-box" style={{ color: 'orange', marginRight: 100 }}>
							<Typography variant="caption" display="block">
								Docker v{context.docker_version} (
								{context.docker_running ? 'running' : 'not running'})
							</Typography>

							<Typography variant="caption" display="block">
								srtool v{context.srtool_version}
								{context.srtool_latest_version != context.srtool_version
									? '( latest: ' + context.srtool_latest_version + ')'
									: ''}
							</Typography>
							<Typography variant="caption" display="block" gutterBottom>
								srtool image: {context.srtool_image}{' '}
								{context.srtool_latest_image != context.srtool_image
									? '( latest: ' + context.srtool_latest_image + ')'
									: ''}
							</Typography>

							<Typography variant="caption" display="block">
								ready: {context.ready?.toString()}
							</Typography>
						</Box>
					)
				}}
			</StatusContext.Consumer>
		)
	}
}
Status.contextType = StatusContext

export default Status
