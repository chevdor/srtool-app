import { Box, Typography } from "@material-ui/core";
import React from "react";
import pkg from "../../package.json";
import Troubleshoot from "./Troubleshoot";

const FooterStyle = {
  marginTop: "calc(5% + 60px)",
  bottom: 0,
  background: "#424242",
};

type State = {
  debug: boolean;
};

type Props = {};

export default class Footer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      debug: false,
    };
  }

  toggleDebug = () => {
    this.setState({ debug: !this.state.debug });
  };

  render() {
    return (
      <div>
        <Box color="text.primary" className="footer" style={FooterStyle}>
          <Typography
            variant="caption"
            onDoubleClick={this.toggleDebug}
            style={{ userSelect: "none" }}
          >
            {`${pkg.name} v${pkg.version} by ${pkg.author}`}
          </Typography>
        </Box>
        <div id="debug" hidden={!this.state.debug}>
          <Troubleshoot />
        </div>
      </div>
    );
  }
}
