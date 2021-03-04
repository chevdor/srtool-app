// TODO: add sponsors such as web3 Foundation
import { Box, styled, Typography } from "@material-ui/core";
import React from "react";

const FooterStyle = {
  marginTop: "calc(5% + 60px)",
  bottom: 0,
  background: "#424242",
};

export default class Footer extends React.Component {
  render() {
    return (
      <Box color="text.primary" className="footer" style={FooterStyle}>
        <Typography variant="caption"></Typography>
      </Box>
    );
  }
}
