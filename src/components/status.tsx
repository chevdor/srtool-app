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
            <Box id="status-box" style={{ color: "orange", marginRight: 100 }}>
              <Typography variant="caption" display="block">Docker version: {context.docker_version}</Typography>
              <Typography variant="caption" display="block" gutterBottom>Docker running: {context.docker_running?.toString()}</Typography>
              
              <Typography variant="caption" display="block">srtool latest version: {context.srtool_latest_version}</Typography>
              <Typography variant="caption" display="block">srtool latest image: {context.srtool_latest_image}</Typography>
              <Typography variant="caption" display="block">srtool version: {context.srtool_version}</Typography>
              <Typography variant="caption" display="block" gutterBottom>srtool image: {context.srtool_image}</Typography>
              
              <Typography variant="caption" display="block">ready: {context.ready?.toString()}</Typography>
            </Box>
          );
        }}
      </StatusContext.Consumer>
    );
  }
}
Status.contextType = StatusContext;

export default Status;
