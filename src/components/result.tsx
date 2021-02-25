import { Box } from "@material-ui/core";
import React from "react";
import {
  OutputContext,
  OutputDataContextContent,
} from "../contexts/outputContext";
import { SRToolOutput, SRToolResult } from "../lib/message";

class SrtoolResultComp extends React.Component<any, any> {
  render() {
    // let props = this.props;
    let context = this.context;
    // console.log("TRACE", context);
    let res: SRToolOutput | null = null; // TODO: Switch that to SRToolResult

    try {
      res = JSON.parse(context.latest);
      console.log("res", res);
    } catch (e) {
      return null;
    }

    return (
      <OutputContext.Consumer>
        {(_) =>
          res ? (
            <Box color="text.primary">
              <div>gen: {res.gen}</div>
              <div>commit: {res.commit}</div>
              <div>proposal hash: {res.prop}</div>
              <div>package: {res.pkg}</div>
              <div>rustc: {res.rustc}</div>
              <div>size: {res.size}</div>
            </Box>
          ) : null
        }
      </OutputContext.Consumer>
    );
  }
}
SrtoolResultComp.contextType = OutputContext;

export default SrtoolResultComp;
