export type RunnerConfig = {
	/** The image to be used. For instance: "chevdor/srtool:nightly-2021-02-25" */
	image: string

	/** Package */
	package: string

	/** Folder where the project is located */
	folder: string

	/** An array of args for `docker run`. Example: `['-t', '--name', 'foobar']`. @deprecated Use Dockerode.ContainerCreateOptions instead  */
	docker_run?: string[]
	/** The args to pass to the image. For instance: `['build', '--json']` */
	image_args?: string[]
}

/**
 * A set of testing runner configs.
 */
export const RunnerConfigs: Record<string, RunnerConfig> = {
	awk_005: {
		image: 'busybox',
		package: 'polkadot-runtime',
		folder: '/tmp/srtool-polkadot-0.8.28',

		docker_run: ['-v', '/tmp/srtool-polkadot-0.8.28-nocolor.log:/data.log'],
		image_args: ['awk', '\'{print $0; system("sleep .005");}\'', '/data.log'],
	},
	awk_01: {
		image: 'busybox',
		package: 'polkadot-runtime',
		folder: '/tmp/srtool-polkadot-0.8.28',
		docker_run: ['-v', '/tmp/srtool-polkadot-0.8.28-nocolor.log:/data.log'],
		image_args: ['awk', '\'{print $0; system("sleep .01");}\'', '/data.log'],
	},
	awk_1: {
		docker_run: ['-v', '/tmp/srtool-polkadot-0.8.28-nocolor.log:/data.log'],
		image: 'busybox',
		package: 'polkadot-runtime',
		folder: '/tmp/srtool-polkadot-0.8.28',
		image_args: ['awk', '\'{print $0; system("sleep .01");}\'', '/data.log'],
	},
	srtool_2020_10_27: {
		image: 'chevdor/srtool:nightly-2020-10-27',
		package: 'polkadot-runtime',
		folder: '/tmp/srtool-polkadot-0.8.28',
		docker_run: [
			'-t',
			'--name',
			'srtool',
			'-v',
			'/tmp/srtool/polkadot-0.8.28:/build',
			'-e',
			'PACKAGE=polkadot-runtime',
		],
		image_args: ['build', '--app'],
	},
	srtool_2021_02_25: {
		docker_run: [
			'-t',
			'--name',
			'srtool',
			'-v',
			'/tmp/srtool/polkadot-0.8.28:/build',
			// "-v", "/tmp/cargo:/cargo-home",
			'-e',
			'PACKAGE=polkadot-runtime',
		],
		image: 'chevdor/srtool:nightly-2021-03-15',
		package: 'polkadot-runtime',
		folder: '/tmp/srtool-polkadot-0.8.28',
		image_args: ['build', '--app'],
	},
	srtool_2021_02_25_dev: {
		image: 'chevdor/srtool-dev:nightly-2021-03-15',
		package: 'polkadot-runtime',
		folder: '/tmp/srtool-polkadot-0.8.28',
		docker_run: [
			'-t',
			'--name',
			'srtool',
			// "-v", "/tmp/srtool/polkadot-0.8.28:/build",
			// "-v", "/tmp/cargo:/cargo-home",
			// "-e", "PACKAGE=polkadot-runtime",
			'-e',
			'SLEEP=0.01',
		],
		image_args: ['build', '--app'],
	},
}
