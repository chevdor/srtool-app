import { Box } from "@material-ui/core";
import React from "react";
import {
  OutputContext,
  OutputDataContextContent,
} from "../contexts/outputContext";
import { SRToolOutput, SRToolResult } from "../lib/message";

/**
 * Show the latest message
 */
class Latest extends React.Component<any, any> {
  render() {
    // let props = this.props;
    let context = this.context;
    const latest = context.latest;

    return (
      <OutputContext.Consumer>
        {(_) => (
          <Box color="text.primary">
            <div>{ latest?.indexOf('{') >= 0 ? '' : latest }</div>
          </Box>
        )}
      </OutputContext.Consumer>
    );
  }
}
Latest.contextType = OutputContext;

export default Latest;
