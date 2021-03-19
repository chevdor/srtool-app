import { Box } from '@material-ui/core'
import React from 'react'
import semver from 'semver'
import Srtool from '../lib/srtool'
import { shell } from 'electron'

/**
 * This component checks whether an update is available
 */
class VersionChecker extends React.Component<any, any> {
	constructor(props?: any) {
		super(props)
		this.state = {
			currentVersion: null,
			latestVersion: null,
		}
	}

	async componentDidMount(): Promise<void> {
		const srtool = new Srtool()
		const latestVersion = await srtool.getSrtoolAppLatestVersion()
		const currentVersion = await srtool.getSrtoolAppCurrentVersion()
		this.setState({ currentVersion, latestVersion })
	}

	render(): React.ReactNode {
		const { currentVersion, latestVersion } = this.state
		if (latestVersion && semver.lt(currentVersion, latestVersion))
			return (
				<Box color="text.secondary">
					<span>Current version: v{this.state.currentVersion}</span> -&nbsp;
					<span>Latest version: v{this.state.latestVersion}</span> -&nbsp;
					<span>
						Download the latest version of Srtool:&nbsp;
						<span
							onClick={() =>
								shell.openExternal(
									'https://gitlab.com/chevdor/srtool-app/-/releases'
								)
							}
						>
							here
						</span>
						.
					</span>
				</Box>
			)
		else
			return (
				<Box color="text.secondary">
					<div>
						You have the latest version of the Srtool App (v
						{this.state.currentVersion})
					</div>
				</Box>
			)
	}
}

export default VersionChecker
