import { Box, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import StatusContext from "../contexts/statusContext";

class Status extends React.Component {
  render() {
    // let props = this.props;
    let context = this.context;
    // console.log("context", context);

    return (
      <StatusContext.Consumer>
        {(context: any) => {
          return (
            <Box style={{ color: "yellow", marginRight: 20 }}>
              <Typography>Docker version: {context.docker_version}</Typography>
              <Typography>Docker running: {context.docker_running?.toString()}</Typography>
              <Typography>srtool version: {context.srtool_version}</Typography>
              <Typography>rustc version: {context.srtool_version}</Typography>
              <Typography>ready: {context.ready?.toString()}</Typography>
            </Box>
          );
        }}
      </StatusContext.Consumer>
    );
  }
}
Status.contextType = StatusContext;

export default Status;
