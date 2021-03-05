import React from "react";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import ChildProcess from "child_process";
import Docker from "dockerode";

// docker inspect srtool | jq ".[].State"
//   {
//     "Status": "running",
//     "Running": true,
//     "Paused": false,
//     "Restarting": false,
//     "OOMKilled": false,
//     "Dead": false,
//     "Pid": 39109,
//     "ExitCode": 0,
//     "Error": "",
//     "StartedAt": "2021-03-05T15:46:29.9761637Z",
//     "FinishedAt": "0001-01-01T00:00:00Z"
//   }

// docker stats --no-stream --format "{{json .}}" srtool | jq
// {
//   "BlockIO": "337MB / 410kB",
//   "CPUPerc": "140.75%",
//   "Container": "srtool",
//   "ID": "2d4641575c10",
//   "MemPerc": "14.25%",
//   "MemUsage": "1.108GiB / 7.778GiB",
//   "Name": "srtool",
//   "NetIO": "175MB / 1.15MB",
//   "PIDs": "27"
// }

export type DockerInspectContent = {
  status: string;
  running: boolean;
  paused: boolean;
  error: string;
  startedAt: Date | null;
  finishedAt: Date | null;
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

// TODO: Query the API instead
async function queryDocker(cmd: string): Promise<any> {
  const spawn = ChildProcess.spawn;
  return new Promise((resolve, reject) => {
    const s = spawn("bash", ["-c", cmd]);

    s.stdout.on("data", (data: Buffer) => {
      const s = data.toString();
      console.log("s", s);
    });

    s.stderr.on("data", (data: Buffer) => {
      console.error(data.toString());
    });

    s.on("exit", (code: any) => {
      if (!code) {
        // console.info(`Exit code: ${code}`);
        resolve({});
      } else {
        // console.error(`Exit code: ${code}`);
        reject({ code });
      }
    });
  });
}

export default class DockerStatus extends React.Component<never, State> {
  private docker: Docker;

  constructor(props: never) {
    super(props);
    this.docker = new Docker({ host: "127.0.0.1", port: 3000 });

    this.docker.info

    this.state = {
      inspect: {
        status: "",
        running: false,
        paused: false,
        error: "string",
        startedAt: null,
        finishedAt: null,
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
        ncpu: null,
        memTotal: null,
      },
    };
  }

  private getSpinnerValue(): number {
    if (this.state.inspect.finishedAt) return 100;
    return 0;
  }

  private async checkAgain(): Promise<void> {
    // docker inspect srtool | jq ".[].State"
    const cmdInspect = "docker inspect srtool";

    // docker stats --no-stream --format "{{json .}}" srtool | jq
    const cmdStats = 'docker stats --no-stream --format "{{json .}}" srtool';

    // docker system info --format "{{json .}}" | jq .NCPU
    // docker system info --format "{{json .}}" | jq .MemTotal
    const cmdInfo = 'docker system info --format "{{json .}}"';

    const inspect = (await queryDocker(cmdInspect)) as DockerInspectContent;
    const stats = (await queryDocker(cmdInspect)) as DockerStatsContent;
    const systemInfo = (await queryDocker(cmdInspect)) as DockerSystemInfo;

    this.setState({ inspect, stats, systemInfo });
  }

  componentDidMount() {
    setInterval(this.checkAgain, 1000e3);
  }

  render() {
    const { inspect, stats, systemInfo } = this.state;

    return (
      <Box id="status-box" style={{ color: "orange" }}>
        <Typography variant="caption" display="block">
          container running: {inspect.running.toString()}
        </Typography>

        <Typography variant="caption" display="block">
          cpu: {stats.cpuPerc}
        </Typography>

        <Typography variant="caption" display="block">
          ncpu: {systemInfo.ncpu} - memTotal: {systemInfo.memTotal}
        </Typography>

        <CircularProgress
          style={{ margin: "40px", alignSelf: "center" }}
          variant={inspect.running ? "indeterminate" : "determinate"}
          value={this.getSpinnerValue()}
        />
      </Box>
    );
  }
}
