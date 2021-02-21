import { Box } from "@material-ui/core";
import React from "react";
import pkg from "../../package.json";
import semver from "semver";
import { net } from "electron";

/**
 * This component checks whether an update is available
 */
class VersionChecker extends React.Component<any, any> {
  repo = "https://gitlab.com/chevdor/confmgr"; // TODO: fix this repo to srtool-app

  constructor(props?: any) {
    super(props);
    this.state = {
      currentVersion: pkg.version,
      latestVersion: null,
    };
  }

  async componentDidMount() {
    const response = await fetch(`${this.repo}/-/raw/master/package.json`);
    const pkgJson = await response.text();
    const pkg = JSON.parse(pkgJson);
    console.log("Got latest version", pkg.version);
    console.log("forcing latest version to something else....");

    // if (response.status == 200) this.setState({ latestVersion });  // TODO: fix that once srtool-app is public, here we fetch the srtool version, not srtool-app
    if (response.status == 200) this.setState({ latestVersion: "0.1.0" });
  }

  render() {
    console.log("latest=", this.state.latestVersion);

    // let props = this.props;
    let { context } = this;

    // TODO: use semver
    if (
      this.state.latestVersion &&
      semver.lt(this.state.currentVersion, this.state.latestVersion)
    )
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
