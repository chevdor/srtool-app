import React from 'react'
import { Version } from '../types'

export type Status = {
	/** The docker client version detected, if any */
	docker_version: Version

	/** Whether the docker daemon is currently running */
	docker_running: boolean

	/** This is the version of srtool. It can also be seen as the version of the srtool build script.
	 * This should be confused with the docker image version. See `rustc`. */
	srtool_version: Version

	/** Latest version of srtool (script) according to the repo */
	srtool_latest_version: Version

	/** The srtool docker images are named after the rustc version used in the image. It is critical that all users use the same
	 * rustc version. So if we find a newer version, we need to strongly invite the user to upgrade. */
	srtool_image: Version

	/** The latest version of the image/rustc that is available. */
	srtool_latest_image: Version

	/** If we detected no critical blocker, the app will be able to run and `ready` switches to true. */
	ready: boolean
}

export type StatusContextContent = Status & StatusSetter

export interface StatusSetter {
	setField: (name: Record<string, any>) => void
}

export const defaultStatusContext: StatusContextContent = {
	docker_version: null, // null means we found no docker
	docker_running: true,
	srtool_version: null,
	srtool_latest_version: null,
	srtool_image: null,
	srtool_latest_image: null,
	ready: false,
	setField: (_: Record<string, any>) => {},
}

const StatusContext = React.createContext(defaultStatusContext)
export default StatusContext
