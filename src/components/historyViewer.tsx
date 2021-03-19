import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { HistoryData, HistoryDataItem } from '../lib/runHistory'
import { HistoryRun } from './historyRun'

export type Props = {
	history: HistoryData
}

export default class HistoryViewer extends React.Component<Props, never> {
	render(): React.ReactNode {
		const { history } = this.props

		const listItems = history.map((item: HistoryDataItem, index: number) => {
			// const { key, result } = item
			return (
				<li key={index}>
					{' '}
					<HistoryRun item={item} />
				</li>
			)
		})

		return (
			<div>
				<Box color="text.primary">
					<Typography variant="h6">HISTORY</Typography>
				</Box>
				<ul style={{ color: 'orange' }}>{listItems}</ul>
			</div>
		)
	}
}
