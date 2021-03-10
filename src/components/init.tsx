import React from "react";
// import is from "electron-is";
import StatusContext, { Status } from "../contexts/statusContext";
import {
  Box,
  CircularProgress,
  createStyles,
  Theme,
  Typography,
  WithStyles,
} from "@material-ui/core";
import os from "os";
import { withStyles } from "@material-ui/core/styles";
import getImage from "../lib/srtool";
import InitCheck, { CheckResult } from "../lib/initChecks";
import Srtool from "../lib/srtool";

export interface Props extends WithStyles<typeof styles> {
  visible: boolean;
}

export interface Step {
  step: number;
  description: string;
  progress: number;
  determinate: boolean;
}

export interface State {
  step: number;
  description: string;
  progress: number;
  determinate: boolean;
  results: CheckResult[];
}

// TODO: check the docker version => is docker installed
// TODO: run something like docker ps => is docker currently running

const steps = {
  _1_start: {
    step: 0,
    description: "Start",
    progress: 5,
    determinate: true,
  },
  _2_docker_installed: {
    step: 1,
    description: "Checking if docker is installed",
    progress: 10,
    determinate: true,
  },
  _3_docker_running: {
    step: 2,
    description: "Checking if docker is running",
    progress: 15,
    determinate: true,
  },
  _4_get_latest_image_version: {
    step: 3,
    description: "Checking what is the latest image version",
    progress: 20,
    determinate: true,
  },
  _5_get_latest_image: {
    step: 4,
    description:
      "Fetching the latest srtool image. It can take a few minutes, be patient...",
    progress: 25,
    determinate: false,
  },
  _6_getting_srtool_version: {
    step: 5,
    description: "Querying srtool version",
    progress: 90,
    determinate: true,
  },
  _7_end: {
    step: 6,
    description: "Finished",
    progress: 100,
    determinate: true,
  },
};

/**
 * This component shows the progress of the init.
 * It performs the following checks:
 * - is docker installed
 * - is docker running
 * - fetch the srtool image and get its version
 * This component updates the StatusContext and will be hidden once
 * all the checks pass, to leave the place to the real app.
 */
class Init extends React.Component<Props, State> {
  // const status = useStatus()
  constructor(props: Props) {
    super(props);
    this.state = {
      step: 0,
      description: "",
      progress: 0,
      determinate: true,
      results: [],
    };
  }

  async componentDidMount() {
    const { context } = this;

    // if (process.env.NODE_ENV === "development") {
    //   console.log('Running in dev mode, skipping init checks');
    //   context.setField({ ready: true })
    // } else
    await this.run(context as Status);
  }

  /**
   * Move to the next step
   */
  private nextStep(step: Step) {
    // const { step: current } = this.state.;
    this.setState(step);
  }

  async run(context: Status) {
    console.log("Starting init checks");
    console.log("context", context);
    const initCheck = new InitCheck();
    const srtool = new Srtool();

    this.nextStep(steps._1_start);
    context.setField({ ready: false });

    // TODO: we may later want to add this check to the list
    const tmpdir = os.tmpdir(); // TODO: use setting folder instead
    const _diskResult = await InitCheck.diskSpace(tmpdir);

    this.nextStep(steps._2_docker_installed);
    const dockerInstalledCheck = await initCheck.dockerVersion();
    context.setField({ docker_version: dockerInstalledCheck.value || null });

    this.nextStep(steps._3_docker_running);
    const dockerRunningCheck = await initCheck.dockerRunning();
    console.log("dockerRunningCheck", dockerRunningCheck);

    context.setField({ docker_running: dockerRunningCheck.value });

    const docker_ok: boolean =
      dockerInstalledCheck.value !== null && dockerRunningCheck.value;

    this.nextStep(steps._4_get_latest_image_version);
    const latestVersionCheck = await initCheck.srtoolLatestversion();
    context.setField({ srtool_latest_version: latestVersionCheck.value });

    const latestImageCheck = await initCheck.srtoolLatestImage();
    context.setField({ srtool_latest_image: latestImageCheck.value });
    if (process.env.NODE_ENV === "development") context.setField({ srtool_latest_image: latestImageCheck.value + '-dev' });

    if (docker_ok) {
      // if (process.env.NODE_ENV !== "development") {
        // TODO: here we could check if we already have it and skip ?
        this.nextStep(steps._5_get_latest_image);
        await srtool.getImage(latestImageCheck.value);
      // }
    }

    this.nextStep(steps._6_getting_srtool_version);
    const srtoolversionCheck = await initCheck.srtoolVersions();
    context.setField({ srtool_version: srtoolversionCheck.value.version });
    context.setField({ srtool_image: srtoolversionCheck.value.rustc });

    context.setField({ ready: docker_ok });

    this.nextStep(steps._7_end);
  }

  render() {
    const { visible, classes } = this.props;
    const { docker_version, docker_running, ready } = this.context;
    const stepsCount = Object.keys(steps).length;

    return (
      visible && (
        <Box
          color="text.primary"
          className={classes.root}
          display="flex"
          justifyContent="center"
          id="init-component"
        >
          <Box
            id="init-content"
            style={{ width: "50%", textAlign: "center" }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <CircularProgress
              style={{ margin: "40px", alignSelf: "center" }}
              variant={this.state.determinate ? "determinate" : "indeterminate"}
              value={this.state.progress}
            />
            <Typography paragraph>
              {`${this.state.step + 1}/${stepsCount}: ${
                this.state.description
              }`}
            </Typography>

            <div hidden={docker_version === null}>
              Checking docker version... found v{docker_version} -{" "}
              {docker_version ? "OK" : "ERROR"}
            </div>
            <div>docker running... {docker_running ? "Yes" : "No"}</div>

            {/* TODO: Hidden for now as it somehow does not hide as it should */}
            {/* <Alert hidden={ this.state.step <= 5 }
              severity={ready ? "success" : "error"}
              color={ready ? "success" : "error"}
              style={{ margin: "20px" }}
            >
              <AlertTitle>{ready ? "Ready" : "Not ready"}</AlertTitle>
              Some of the checks failed so srtool cannot run any further.
              <br />
              Please check the messages above and restart srtool.
            </Alert> */}
          </Box>
        </Box>
      )
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      // color: "red",
      margin: "0px 50px 0px 50px ",
      padding: "20px",
      border: "1px solid red",
    },
  });

Init.contextType = StatusContext;
export default withStyles(styles)(Init);
