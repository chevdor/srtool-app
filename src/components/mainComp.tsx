import React from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Typography,
} from "@material-ui/core";
import {
  OutputContext,
  OutputDataContextContent,
} from "../contexts/outputContext";
import OutputConsole from "./outputConsole";
import SrtoolResultComp from "./result";
import Latest from "./latest";
import Verif from "./verif";
import RunnerComp from "./runnerComp";
import RunHistory, { HistoryKey } from "../lib/runHistory";
import HistoryViewer from "./historyViewer";
import { AppStorage } from "./types";
import Store from "electron-store";
import RestoreIcon from "@material-ui/icons/Restore";
import FavoriteIcon from "@material-ui/icons/Favorite";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Footer from "./footer";
import SettingsComp from "./settingsComp";
export type MainCompProps = { visible: boolean };
/**
 * Show the latest message
 */
class MainComp extends React.Component<MainCompProps, any> {
  render() {
    const { visible } = this.props;
    const store = new Store<AppStorage>();

    let context: OutputDataContextContent = this.context;
    const { result } = context;

    // If we got a result, we add to the history
    if (result) {
      console.log("MainComp result", result);
      const history = new RunHistory();

      const historyKey: HistoryKey = {
        srtoolImage: "chevdor/srtool:nightly-2021-02-25", // TODO: fix that and use real value
        srtoolVersion: "0.9.6", // TODO: fix that and use real value => result.generator,
        gitCommit: result.git.commit,
        date: result.time,
        package: result.package,
      };

      history.addRun(historyKey, result);
    }

    return !visible ? null : (
      <div>
        <OutputContext.Consumer>
          {(_) => (
            <div>
              <RunnerComp />
              <OutputConsole />
              {/* <Latest /> */}
              <SrtoolResultComp result={result} />
              {/* <Verif /> */}
            </div>
          )}
        </OutputContext.Consumer>

        <SettingsComp />

        {/* {process.env.NODE_ENV === "development" && (
           <HistoryViewer history={store.store.history} />
        )} */}

        {/* <BottomNavigation showLabels>
          <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
          <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
        </BottomNavigation> */}

        <Footer />
      </div>
    );
  }
}
MainComp.contextType = OutputContext;
export default MainComp;
