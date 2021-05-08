import React from 'react'
import {
	OutputContext,
	OutputDataContextContent,
} from '../contexts/outputContext'
import OutputConsole from './outputConsole'
import SrtoolResultComp from './result'
import RunnerComp from './runnerComp'
import RunHistory, { HistoryKey } from '../lib/runHistory'
import Footer from './footer'
export type MainCompProps = { visible: boolean }

/**
 * Show the latest message
 */
class MainComp extends React.Component<MainCompProps, any> {
	render(): React.ReactNode {
		const { visible } = this.props
		// const store = new Store<AppStorage>()

		let context: OutputDataContextContent = this.context
		const { result } = context

		// If we got a result, we add to the history
		if (result) {
			console.log('MainComp result', result)
			const history = new RunHistory()

			const historyKey: HistoryKey = {
				srtoolImage: 'chevdor/srtool:nightly-2021-03-15', // TODO IMAGE: fix that and use real value
				srtoolVersion: '0.9.10', // TODO HISTORY: fix that and use real value => result.generator,
				gitCommit: result.git.commit,
				date: result.time,
				package: result.package,
			}

			history.addRun(historyKey, result)
		}

		return !visible ? null : (
			<div>
				<OutputContext.Consumer>
					{_ => (
						<div>
							<RunnerComp />
							<OutputConsole />
							{/* <Latest /> */}
							<SrtoolResultComp result={result} />
							{/* <Verif /> */}
						</div>
					)}
				</OutputContext.Consumer>

				{/* <SettingsComp /> */}

				{/* {process.env.NODE_ENV === "development" && (
					<HistoryViewer history={store.store.history} />
					)} */}

				{/* <BottomNavigation showLabels>
				<BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
				<BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
				<BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
				</BottomNavigation> */}

				<Footer />
			</div>
		)
	}
}
MainComp.contextType = OutputContext
export default MainComp
