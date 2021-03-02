import { Box, Typography } from "@material-ui/core";
import React from "react";
import { SRToolResult } from "../lib/message";
import Hash from "./hash";
import Pre from "./pre";

export type Props = {
  result: SRToolResult;
};

class SrtoolResultComp extends React.Component<Props, never> {
  render() {
    const { result } = this.props;

    return result ? (
      <Box color="text.primary" style={{ margin: "20px" }}>
        <Box id="context">
          <Typography variant="overline" display="block">
            Context
          </Typography>

          <Typography variant="body1">gen: {result.generator}</Typography>
          <Typography variant="body1">
            commit: <Pre content={result.git.commit} />
          </Typography>
          <Typography variant="body1">branch: {result.git.branch}</Typography>
          <Typography variant="body1">tag: {result.git.tag}</Typography>
          <Typography variant="body1">package: {result.package}</Typography>
          <Typography variant="body1">rustc: {result.rustc}</Typography>
          <Typography gutterBottom />
        </Box>

        <Box id="result">
          <Typography variant="overline" display="block">
            Result
          </Typography>

          <Typography variant="body1">
            proposal hash: <Hash content={result.proposalHash} />
          </Typography>
          <Typography variant="body1">size: {result.size} bytes</Typography>
          <Typography variant="body1">
            time: {result.time.toString()}
          </Typography>
          {/* <Typography variant="body1">duration: {`${result.duration}ms`}</Typography> */}
          <Typography variant="body1">
            sha256: <Hash content={result.sha256} />
          </Typography>
          <Typography variant="body1">wasm path: {result.wasm.path}</Typography>
          <Typography gutterBottom />
        </Box>
      </Box>
    ) : null;
  }
}

export default SrtoolResultComp;
