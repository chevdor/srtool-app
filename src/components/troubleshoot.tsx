import React from 'react'
import { Box, Button, Container, Typography } from '@material-ui/core'
import Srtool from '../lib/srtool'

export type Props = {}

const styles = {
	box: { margin: '20px' },
	button: { border: '1px solid #ff9800', marginRight: '10px' },
}

/**
 * This component is currently not visible by default.
 * It can be shown by double clicking the footer.
 * It then shows a few buttons that may help fixing some issues.
 */
class Troubleshoot extends React.Component<Props, never> {
	#srtool = new Srtool()

	render(): React.ReactNode {
		return (
			<Container>
				<Box color="text.primary" style={styles.box}>
					<Typography variant="body1">
						The buttons below may help you troubleshoot some issues. Don't use
						them unless instructed to do so or if you know what you are doing.
					</Typography>
				</Box>

				<Box color="text.primary" style={styles.box}>
					<Typography variant="body2">
						If srtool is currently running and you need to interrupt it, you may
						click this button. Beware that any work done so far will be lost:
						your next run will start from stratch.
					</Typography>
					<Button
						style={styles.button}
						color="primary"
						onClick={async () => {
							await this.#srtool.removeContainer()
						}}
					>
						Remove Container
					</Button>
				</Box>

				<Box color="text.primary" style={styles.box} hidden={true}>
					<Button style={styles.button} color="primary" onClick={() => {}}>
						Reset Settings
					</Button>
				</Box>

				<Box color="text.primary" style={styles.box} hidden={true}>
					<Button style={styles.button} color="primary" onClick={() => {}}>
						Reset Containers
					</Button>
				</Box>

				<Box color="text.primary" style={styles.box} hidden={false}>
					<Typography variant="body2">
						Overtime, you may accumulate several older images. This button will
						delete all srtool images. You will recover disk space and there is
						no risk in doing so. Make sure to restart the Application after that
						and only the latest srtool image will be downloaded.
					</Typography>
					<Button
						style={styles.button}
						color="primary"
						onClick={async () => {
							await this.#srtool.removeImages()
						}}
					>
						Reset Images
					</Button>
				</Box>
			</Container>
		)
	}
}

export default Troubleshoot
