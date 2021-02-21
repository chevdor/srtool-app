import { Box, Typography } from "@material-ui/core";
import React from "react";
import Status from "./status";

const Header = () => {
  return (
    <Box>
      <div>
        <Typography variant="h1" color="primary" component="h2" gutterBottom>
          srtool
        </Typography>
      </div>
      <div>
        <Status></Status>
      </div>
    </Box>
  );
};

export default Header;
