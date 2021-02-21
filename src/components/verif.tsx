import { Box, TextField } from "@material-ui/core";
import React from "react";
import { createUseStyles } from "react-jss";
import {
  OutputContext,
  OutputDataContextContent,
} from "../contexts/outputContext";
import { SRToolOutput, SRToolResult } from "../lib/message";

/**
 * This component allows verifying (ie comparing the proposal hash)
 * with a reference.
 */
class Verif extends React.Component<any, any> {
  render() {
    // let props = this.props;
    let context = this.context;
    this.state = {
        target: ""
    };
    
    return (
      <OutputContext.Consumer>
        {(context) => (
          <form noValidate autoComplete="off">
            <div>
              <TextField
                error= {false}
                id="target-proposal-hash"
                label="Target Proposal Hash"
                // defaultValue="Hello World"
                helperText= { false ? "Incorrect entry.": null}
                variant="filled"
                fullWidth
              />
            </div>
          </form>
        )}
      </OutputContext.Consumer>
    );
  }
}
Verif.contextType = OutputContext;

export default Verif;
