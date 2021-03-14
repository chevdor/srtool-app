import React from "react";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import DockerWrapper from "../lib/dockerWrapper";

// TODO: Dockerode likely defined this type already
export type DockerInspectContent = {
  Status: string;
  Running: boolean;
  Paused: boolean;
  Error: string;
  StartedAt: string | null;
  FinishedAt: string | null;
};

export type DockerStatsContent = {
  cpuPerc: string;
  container: string;
  id: string;
  memPerc: string;
  memUsage: string;
  name: string;
  netIO: string;
  pids: number | null;
};

export type DockerSystemInfo = {
  NCPU: number | null;
  MemTotal: number | null;
};

export type DockerStats = {
  inspect: DockerInspectContent;
  stats: DockerStatsContent;
  systemInfo: DockerSystemInfo;
};

type State = DockerStats;

export default class DockerStatus extends React.Component<any, State> {
  #dockerWrapper: DockerWrapper;

  constructor(props: never) {
    super(props);
    this.#dockerWrapper = new DockerWrapper();

    this.state = {
      inspect: {
        Status: "",
        Running: false,
        Paused: false,
        Error: "string",
        StartedAt: null,
        FinishedAt: null,
      },
      stats: {
        cpuPerc: "",
        container: "",
        id: "",
        memPerc: "",
        memUsage: "",
        name: "",
        netIO: "",
        pids: null,
      },
      systemInfo: {
        NCPU: null,
        MemTotal: null,
      },
    };
  }

  private getSpinnerValue(): number {
    if (this.state.inspect.FinishedAt) return 100;
    return 0;
  }

  /** This function is called repeatedly while srtool is running into order to collect a few metrics
   * It is mainly done to reinsure the user that "it is working" despite the process taking a long time.
   */
  private async checkAgain(): Promise<void> {
    const container = await this.#dockerWrapper.getContainer();

    if (container) {
      const inspect = await container.inspect();
      // const stats = await container.stats();

      this.setState({ inspect: inspect.State });
    } else {
      this.setState({
        inspect: {
          Running: false,
          Error: "",
          FinishedAt: "",
          Paused: false,
          Status: "Not running",
          StartedAt: "",
        },
      });
    }
  }

  async componentDidMount() {
    const docker = this.#dockerWrapper.docker;

    const intervalInSeconds = 3;
    setInterval(this.checkAgain.bind(this), intervalInSeconds * 1e3);
    const systemInfo = await docker.info();
    this.setState({ systemInfo });
  }

  render() {
    const { inspect, stats, systemInfo } = this.state;

    return (
      <Box id="status-box" style={{ color: "orange" }}>
        <Typography variant="caption" display="block">
          ncpu: {`${systemInfo.NCPU || "n/a"} cores`}
        </Typography>
        <Typography variant="caption" display="block">
          memTotal:{" "}
          {`${
            systemInfo.MemTotal
              ? (systemInfo.MemTotal / 1024 / 1024 / 1024).toFixed(2)
              : "n/a"
          } GB`}
        </Typography>

        <Typography variant="caption" display="block">
          srtool running: {inspect.Running.toString()}
        </Typography>

        <CircularProgress
          style={{ margin: "40px", alignSelf: "center" }}
          variant={inspect.Running ? "indeterminate" : "determinate"}
          value={this.getSpinnerValue()}
        />
      </Box>
    );
  }
}
