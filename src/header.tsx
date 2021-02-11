import { Box, Typography } from "@material-ui/core";
import React from "react";
import './main.css'

function Header() {
  return (
    <Box>
      <Typography variant="h1" color="primary" component="h2" gutterBottom>
        srtool
      </Typography>
    </Box>
  );
}

export default Header;
