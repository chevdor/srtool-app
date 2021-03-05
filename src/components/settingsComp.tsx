import React from "react";
import { Box, Typography } from "@material-ui/core";
import SettingsContext from "../contexts/settingsContext";

export default class SettingsComp extends React.Component<any, any> {
  constructor(props: never) {
    super(props);
    this.state = {};
  }

  render() {
    const handleRcChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({ includeRc: event.target.checked });
    };

    return (
      <SettingsContext.Consumer>
        {(settings) => (
          <Box color="text.primary">
            <Typography variant="h6">Settings</Typography>
            <Typography variant="caption">
              projectPath: {settings.local.projectPath}
            </Typography>
          </Box>
        )}
      </SettingsContext.Consumer>
    );
  }
}
