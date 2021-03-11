/**
 * A set of testing runner configs.
 */
export const RunnerConfig = {
    awk_005: {
        docker_run: ["-v", "/tmp/srtool-polkadot-0.8.28-nocolor.log:/data.log"],
        image: "busybox",
        image_args: [
            "awk",
            "'{print $0; system(\"sleep .005\");}'",
            "/data.log",
        ],
    },
    awk_01: {
        docker_run: ["-v", "/tmp/srtool-polkadot-0.8.28-nocolor.log:/data.log"],
        image: "busybox",
        image_args: [
            "awk",
            "'{print $0; system(\"sleep .01\");}'",
            "/data.log",
        ],
    },
    awk_1: {
        docker_run: ["-v", "/tmp/srtool-polkadot-0.8.28-nocolor.log:/data.log"],
        image: "busybox",
        image_args: [
            "awk",
            "'{print $0; system(\"sleep .01\");}'",
            "/data.log",
        ],
    },
    srtool_2020_10_27: {
        docker_run: [
            "-t",
            "--name", "srtool",
            "-v", "/tmp/srtool/polkadot-0.8.28:/build",
            "-e", "PACKAGE=polkadot-runtime"],
        image: "chevdor/srtool:nightly-2020-10-27",
        image_args: [
            "build",
            "--app",
        ],
    },
    srtool_2021_02_25: {
        docker_run: [
            "-t",
            "--name", "srtool",
            "-v", "/tmp/srtool/polkadot-0.8.28:/build",
            // "-v", "/tmp/cargo:/cargo-home",
            "-e", "PACKAGE=polkadot-runtime"],
        image: "chevdor/srtool:nightly-2021-02-25",
        image_args: [
            "build",
            "--app",
        ],
    },
    srtool_2021_02_25_dev: {
        docker_run: [
            "-t",
            "--name", "srtool",
            // "-v", "/tmp/srtool/polkadot-0.8.28:/build",
            // "-v", "/tmp/cargo:/cargo-home",
            // "-e", "PACKAGE=polkadot-runtime",
            "-e", "SLEEP=0.01",
        ],
        image: "chevdor/srtool-dev:nightly-2021-02-25",
        image_args: [
            "build",
            "--app",
        ],
    }
}