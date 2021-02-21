import React, { useContext, useEffect } from "react";
import is from "electron-is";
import StatusContext from "../contexts/statusContext";
import { Box, CircularProgress } from "@material-ui/core";

const useStatus = () => useContext(StatusContext)

// TODO: check the docker version => is docker installed
// TODO: run something like docker ps => is docker currently running

/**
 * This component shows the progress of the init.
 * It performs the following checks:
 * - is docker install
 * - is docker running
 * - fetch the srtool image and get its version
 * This component updates the StatusContext and will be hidden once
 * all the checks pass, to leave the place to the real app.
 */
class Init extends React.Component<any, any> {
  // const status = useStatus()
  
  componentDidMount() {
    this.run()
  }

  run() {
    let spawn = require("child_process").spawn;
    console.log("Starting checks");
    
    let bat = spawn("bash", ["-c", "docker --version"]);

    bat.stdout.on("data", (data: any) => {
      console.log(data.toString());
    });

    bat.stderr.on("data", (err: any) => {
      console.log(err.toString());
    });

    bat.on("exit", (code: any) => {
      console.log(code);
    });
  }

  render() {
    
    return (
      <Box color="text.primary">
        <div >INIT</div>
        <CircularProgress />

      </Box>
    );
  }
}
Init.contextType = StatusContext;
export default Init;
