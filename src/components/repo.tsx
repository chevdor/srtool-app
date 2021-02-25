import { Button, IconButton } from "@material-ui/core";
import React from "react";
const { shell } = require("electron");
import BugIcon from "@material-ui/icons/BugReport";

const Repo = () => {
  // BugReport
  return (
    <IconButton
      color="primary"
      aria-label="Report issue"
      onClick={() => shell.openExternal("https://gitlab.com/chevdor/srtool-app/-/issues")}
    >
      <BugIcon />
    </IconButton>
  );
};

export default Repo;
