import React, { useContext } from "react";
import StatusContext, {
  Status,
  StatusContextContent,
} from "../contexts/statusContext";
import {
  Box,
  Button,
  CircularProgress,
  createStyles,
  Theme,
  Typography,
  WithStyles,
} from "@material-ui/core";
import os from "os";
import { withStyles } from "@material-ui/core/styles";
import InitCheck, { CheckResult } from "../lib/initChecks";
import Srtool from "../lib/srtool";
import SettingsContext from "../contexts/settingsContext";
import { SettingsContextContent } from "../lib/settings";
import { assert } from "../lib/assert";
import mkdirp from 'mkdirp'

export interface Props extends WithStyles<typeof styles> {
  visible: boolean;
  settings: SettingsContextContent;
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
      "Fetching the latest srtool image. It takes a few minutes (depending on your connection), be patient...",
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
    const { context: status } = this;
    const { settings } = this.props;
    await this.run(status, settings);
  }

  /** Bascically ensures the folder is created */
  async initCargoCache(settings: SettingsContextContent): Promise<void> {
    console.log(`Making sure ${settings.local.cargoCache} is created`);
    await mkdirp(settings.local.cargoCache);
    console.log(`Cache is currently set to be ${settings.srtool.useCache ? '' : 'NOT '}used`)
  }

  /**
   * Move to the next step
   */
  private nextStep(step: Step) {
    this.setState(step);
  }

  async run(status: StatusContextContent, settings: SettingsContextContent) {
    console.log("Starting init checks");
    console.log("status context", status);
    console.log("settings context", settings);
    
    const initCheck = new InitCheck(settings);
    const srtool = new Srtool();

    this.nextStep(steps._1_start);
    await this.initCargoCache(settings);
    status.setField({ ready: false });

    // We may later want to add this check to the list of checks, for now this is just an info
    const tmpdir = settings.local.workDir;
    const _diskResult = await InitCheck.diskSpace(tmpdir);

    this.nextStep(steps._2_docker_installed);
    const dockerInstalledCheck = await initCheck.dockerVersion();
    status.setField({ docker_version: dockerInstalledCheck.value || null });

    this.nextStep(steps._3_docker_running);
    const dockerRunningCheck = await initCheck.dockerRunning();
    console.log("dockerRunningCheck", dockerRunningCheck);

    status.setField({ docker_running: dockerRunningCheck.value });

    const docker_ok: boolean =
      dockerInstalledCheck.value !== null && dockerRunningCheck.value;

    this.nextStep(steps._4_get_latest_image_version);
    const latestVersionCheck = await initCheck.srtoolLatestversion();
    status.setField({ srtool_latest_version: latestVersionCheck.value });

    const latestImageCheck = await initCheck.srtoolLatestImage();
    status.setField({ srtool_latest_image: latestImageCheck.value });
  
    if (docker_ok) {
      this.nextStep(steps._5_get_latest_image);
      await srtool.getImage(latestImageCheck.value);
    }

    this.nextStep(steps._6_getting_srtool_version);
    const srtoolversionCheck = await initCheck.srtoolVersions();
    status.setField({ srtool_version: srtoolversionCheck.value.version });
    status.setField({ srtool_image: srtoolversionCheck.value.rustc });

    status.setField({ ready: docker_ok });

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
            <div>
              docker running...{" "}
              {docker_running
                ? "Yes"
                : "No. Press CTRL+R or CMD+R to test again"}
            </div>

            {/* TODO LATER: Hidden currently as it somehow does not hide as it should */}
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
      margin: "0px 50px 0px 50px ",
      padding: "20px",
    },
    debug: {
      margin: "0px 50px 0px 50px ",
      padding: "20px",
      border: "1px solid red",
    },
  });

Init.contextType = StatusContext;
export default withStyles(styles)(Init);
