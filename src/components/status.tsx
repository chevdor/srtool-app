import { Box } from "@material-ui/core";
import React, { useContext } from "react";
import StatusContext from "../contexts/statusContext";
const useStatus = () => useContext(StatusContext);

// const Status = () => {
//   // status = useStatus();

//   return (

//     <Box style={{color: "yellow"}}>
//       <div>Docker version: {this.context.status.docker.version}</div>
//       <div>Docker running: {status.docker.running.toString()}</div>
//       <div>srtool version: {status.srtool.version}</div>
//     </Box>
//   );
// };

// export default Status;

class Status extends React.Component {
  render() {
    let props = this.props;
    let context = this.context;
    // console.log("context", context);

    return (
      <Box style={{ color: "yellow" }}>
        <div>Docker version: {context.docker.version}</div>
        <div>Docker running: {context.docker.running.toString()}</div>
        <div>srtool version: {context.srtool.version}</div>
      </Box>
    );
  }
}
Status.contextType = StatusContext;

export default Status;
