import React from "react";
import { Box, Typography } from "@material-ui/core";
import {
  OutputContext,
  OutputDataContextContent,
} from "../contexts/outputContext";
import OutputConsole from "./outputConsole";
import SrtoolResultComp from "./result";
import Latest from "./latest";
import Verif from "./verif";
import RunnerComp from "./runnerComp";

export type MainCompProps = { visible: boolean };
/**
 * Show the latest message
 */
class MainComp extends React.Component<MainCompProps, any> {
  render() {
    const { visible } = this.props;

    let context: OutputDataContextContent = this.context;
    const { result } = context;

    return !visible ? null : (
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
    );
  }
}
MainComp.contextType = OutputContext;
export default MainComp;
