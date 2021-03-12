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
import Footer from "./footer";
import SettingsComp from "./settingsComp";
import { SRToolResult } from "../lib/message";
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

    // The following is there for debugging
    // TODO: remove debugging stuff !
    // const result2: SRToolResult = {
    //   generator: "srtool v0.9.6",
    //   git: {
    //     commit: "371681c298eb96b74ad04a09ca8097f19c777e68",
    //     tag: "v0.8.28",
    //     branch: "heads/v0.8.28",
    //   },
    //   rustc: "rustc 1.49.0-nightly (fd542592f 2020-10-26)",
    //   package: "polkadot-runtime",
    //   time: new Date(),
    //   duration: 4980000,
    //   size: 2151335,
    //   proposalHash:
    //     "0x8e2a831f00c994558f75a7a4ef1d71d173a87365079280952ec2a4b56a36275b",
    //   sha256:
    //     "887c755518ead3af05e95d0db16473e26a4bdcfd9ca4d45db88144bd10db26c1",
    //   wasm: {
    //     path: "/some/path/runtime.wasm",
    //   },
    // };

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
