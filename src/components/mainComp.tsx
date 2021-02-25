import { Box, Typography } from "@material-ui/core";
import React from "react";
import BtnRun from "./runner";
import Latest from "./latest";
import OutputConsole from "./outputConsole";
import SrtoolResultComp from "./result";
import Verif from "./verif";
import { OutputContext } from "../contexts/outputContext";

export type MainCompProps = { visible: boolean };
/**
 * Show the latest message
 */
class MainComp extends React.Component<MainCompProps, any> {
  render() {
    const { visible } = this.props;
    let context = this.context;
    const latest = context.latest;

    return !visible ? null : (
      <OutputContext.Consumer>
        {(_) => (
          <div>
            <BtnRun />
            <OutputConsole />
            {/* <Latest /> */}
            <SrtoolResultComp /> 
            {/* <Verif /> */}
          </div>
        )}
      </OutputContext.Consumer>
    );
  }
}
MainComp.contextType = OutputContext;
export default MainComp;
