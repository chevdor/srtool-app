import { Box, Typography } from "@material-ui/core";
import React from "react";
import Repo from "./repo";
import Status from "./status";

const Header = () => {
  return (
    <Box display="flex" style={{margin: "0px", padding: "10px", backgroundColor: "#ff980020"}}>
      <Box flexGrow={1}>
        <Typography variant="h1" color="primary" component="h2" gutterBottom>
          srtool
        </Typography>
      </Box>

      <Box width="400px">
        <Status />
      </Box>

      <Box>
        <Repo />
      </Box>
    </Box>
  );
};

export default Header;
