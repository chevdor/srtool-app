import { Box } from "@material-ui/core";
import React from "react";
import semver from "semver";
// import { net } from "electron";
import { getSrtoolAppCurrentVersion, getSrtoolAppLatestVersion } from "../lib/srtool";

/**
 * This component checks whether an update is available
 */
class VersionChecker extends React.Component<any, any> {

  constructor(props?: any) {
    super(props);
    this.state = {
      currentVersion: null,
      latestVersion: null,
    };
  }

  async componentDidMount() {
    const latestVersion = await getSrtoolAppLatestVersion();
    const currentVersion = await getSrtoolAppCurrentVersion();
    this.setState({ currentVersion, latestVersion });
  }

  render() {
    const { currentVersion, latestVersion } = this.state;

    if (latestVersion && semver.lt(currentVersion, latestVersion))
      return (
        <Box color="text.secondary">
          <div>current: v{this.state.currentVersion}</div>
          <div>latest: {this.state.latestVersion}</div>
          <div>DOWNLOAD LATEST</div>
        </Box>
      );
    else
      return (
        <Box color="text.secondary">
          <div>You have the latest version: v{this.state.currentVersion}</div>
        </Box>
      );
  }
}

export default VersionChecker;
