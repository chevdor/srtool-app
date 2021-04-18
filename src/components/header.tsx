import { Box, Typography } from '@material-ui/core'
import React from 'react'
import DockerStatus from './dockerStatus'
import Repo from './repo'
import Status from './status'
import Stopwatch from './stopwatch'

const Header = (): React.ReactNode => {
	return (
		<Box
			display="flex"
			style={{ margin: '0px', padding: '10px', backgroundColor: '#ff980020' }}
		>
			<Box flexGrow={1}>
				<Typography
					variant="h1"
					color="primary"
					component="h2"
					style={{ margin: '0px 20px 0px 20px', userSelect: 'none' }}
				>
					srtool
				</Typography>
			</Box>

			<Box width="250px">
				<DockerStatus />
				{/* <Stopwatch  /> */}
			</Box>

			<Box width="450px">
				<Status />
			</Box>

			<Box>
				<Repo />
			</Box>
		</Box>
	)
}

export default Header
