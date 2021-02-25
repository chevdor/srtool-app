import { Box, TextField, Typography } from "@material-ui/core";
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
    // let context = this.context;
    this.state = {
      target: "",
    };

    return (
      <OutputContext.Consumer>
        {(context) => (
          <form noValidate autoComplete="off">
            <Box color="text.primary" style={{ padding: "20px" }}>
              <label htmlFor="computed-proposal-hash">Proposal Hash from your run</label>
              <TextField
                error={false}
                id="computed-proposal-hash"
                label="Computed Proposal Hash"
                helperText={false ? "Incorrect entry." : null}
                variant="filled"
                disabled
                value={JSON.stringify(context?.result)}
                fullWidth
              />

              <br/><br/>
              <label htmlFor="reference-proposal-hash">Reference to compare it to</label>
              <TextField
                error={false}
                id="reference-proposal-hash"
                label="Reference Proposal Hash"
                helperText={false ? "Incorrect entry." : null}
                variant="filled"
                fullWidth
              />
              <span>OK ? {context?.result?.toString() || ""}</span>
            </Box>
          </form>
        )}
      </OutputContext.Consumer>
    );
  }
}
Verif.contextType = OutputContext;

export default Verif;
