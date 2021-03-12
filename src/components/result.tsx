import { Box, Button, Typography } from "@material-ui/core";
import React from "react";
import { SRToolResult } from "../lib/message";
import Hash from "./hash";
import Pre from "./pre";
import { clipboard } from "electron";

export type Props = {
  result: SRToolResult;
};

export type ExportFormat = "text" | "markdown" | "json" | "proposalHash";

class SrtoolResultComp extends React.Component<Props, never> {
  private resultToString(
    r: SRToolResult,
    format: ExportFormat = "text"
  ): string {
    let res = "";

    switch (format) {
      case "json":
        res = JSON.stringify(r, null, 2);
        break;
      case "proposalHash":
        res = r.proposalHash;
        break;
      case "markdown":
        res += `I ran \`srtool\` to generate and verifiy a substrate runtime and there is my result:\n`;
        res += `- generator: \`${r.generator}\`\n`;
        res += `- git:\n`;
        res += `  - commit: \`${r.git.commit}\`\n`;
        res += `  - tag: \`${r.git.tag}\`\n`;
        res += `  - branch: \`${r.git.branch}\`\n`;
        res += `- package: \`${r.package}\`\n`;
        res += `- rustc: \`${r.rustc}\`\n`;
        // res += `- duration: \`${r.duration}\`\n`;
        res += `- proposalHash: \`${r.proposalHash}\`\n`;
        res += `- sha256: \`${r.sha256}\`\n`;
        res += `- size: \`${r.size}\`\n`;
        res += `- time: \`${r.time}\`\n`;
        break;
      case "text":
        res += `I ran srtool to generate and verifiy a substrate runtime and there is my result:\n`;
        res += `- generator: ${r.generator}\n`;
        res += `- git:\n`;
        res += `  - commit: ${r.git.commit}\n`;
        res += `  - tag: ${r.git.tag}\n`;
        res += `  - branch: ${r.git.branch}\n`;
        res += `- package: ${r.package}\n`;
        res += `- rustc: ${r.rustc}\n`;
        // res += `- duration: ${r.duration}\n`;
        res += `- proposalHash: ${r.proposalHash}\n`;
        res += `- sha256: ${r.sha256}\n`;
        res += `- size: ${r.size}\n`;
        res += `- time: ${r.time}\n`;
        break;
      default:
        throw new Error(`Format ${format} is not supported`);
    }
    return res;
  }

  private copyResultToClipboard(
    result: SRToolResult,
    format: ExportFormat = "text"
  ) {
    console.log("Copying result to clipboard", result);
    clipboard.writeText(this.resultToString(result, format));
    console.log("Result copied to clipboard");
  }

  render() {
    const { result } = this.props;

    return result ? (
      <Box color="text.primary" style={{ margin: "20px" }}>
        <Button
          style={{ border: "1px solid #ff9800", marginRight: '10px' }}
          color="primary"
          onClick={() => {
            this.copyResultToClipboard(result, "text");
          }}
        >
          Copy TXT
        </Button>
        <Button
          style={{ border: "1px solid #ff9800", marginRight: '10px' }}
          color="primary"
          onClick={() => {
            this.copyResultToClipboard(result, "markdown");
          }}
        >
          Copy Markdown
        </Button>
        <Button
          style={{ border: "1px solid #ff9800", marginRight: '10px' }}
          color="primary"
          onClick={() => {
            this.copyResultToClipboard(result, "json");
          }}
        >
          Copy JSON
        </Button>

        {/* TODO: The following should be done within the 'Hash' component, or even for all fields ? */}
        <Button
          style={{ border: "1px solid #ff9800", marginRight: '10px' }}
          color="primary"
          onClick={() => {
            this.copyResultToClipboard(result, "proposalHash");
          }}
        >
          Copy Prop. Hash
        </Button>
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
