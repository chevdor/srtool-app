import React from 'react'
import { OutputContext } from '../contexts/outputContext'
import { EmulatorState, OutputFactory, Outputs } from 'javascript-terminal'
import { Box } from '@material-ui/core'
import ReactTerminal from 'react-terminal-component'

// const useStyles = createUseStyles({
// 	wrapper: {
// 		padding: [10, 10],
// 		textAlign: 'right',
// 	},
// 	output: {
// 		background: '#2f752a0a',
// 		borderRadius: '3px',
// 	},
// })

class OutputConsole extends React.Component<any, any> {
	defaultState = EmulatorState.createEmpty()
	defaultOutputs = this.defaultState.getOutputs()

	constructor(props: any) {
		super(props)
	}

	// TODO LATER: The following is far from efficient over time as we recreate the whole output
	render(): React.ReactNode {
		return (
			<Box
				color="text.primary"
				id="console-main"
				style={{ border: '1px solid #999', borderRadius: '5px' }}
			>
				<OutputContext.Consumer>
					{(context: any) => {
						const newOutputs = Outputs.addRecord(
							this.defaultOutputs,
							OutputFactory.makeTextOutput(context.joinedMessages || '')
						)
						const emulatorState = this.defaultState.setOutputs(newOutputs)
						return (
							<ReactTerminal
								acceptInput={false}
								theme={{
									height: '25vh',
									width: '100%',
									'overflow-x': 'hidden!important',
								}}
								emulatorState={emulatorState}
							/>
						)
					}}
				</OutputContext.Consumer>
			</Box>
		)
	}
}
OutputConsole.contextType = OutputContext

export default OutputConsole
