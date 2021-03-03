import React from "react";
import { createUseStyles } from "react-jss";
import { OutputContext } from "../contexts/outputContext";
import ReactTerminal from "react-terminal-component";
import { EmulatorState, OutputFactory, Outputs } from "javascript-terminal";
import { Box } from "@material-ui/core";
import { Message } from "../lib/message";

const useStyles = createUseStyles({
  wrapper: {
    padding: [10, 10],
    textAlign: "right",
  },
  output: {
    background: "#2f752a0a",
    borderRadius: "3px",
  },
});

class OutputConsole extends React.Component<any, any> {
  defaultState = EmulatorState.createEmpty();
  defaultOutputs = this.defaultState.getOutputs();

  constructor(props: any) {
    super(props);
  }

  // TODO: The following is far from efficient over time as we recreate the whole output
  render() {
    // let props = this.props;
    // let context = this.context;

    return (
      <Box
        color="text.primary"
        id="console-main"
        style={{ border: "1px solid #999", borderRadius: "5px" }}
      >
        <OutputContext.Consumer>
          {(context: any) => {
            // console.log('TRACE console', context.latest);
            const newOutputs = Outputs.addRecord(
              this.defaultOutputs,
              OutputFactory.makeTextOutput(context.joinedMessages || "")
              // OutputFactory.makeTextOutput( context.messages.join('\n') )
            );
            const emulatorState = this.defaultState.setOutputs(newOutputs);
            return (
              <ReactTerminal
                acceptInput={false}
                theme={{
                  height: "25vh",
                  width: "100%",
                  "overflow-x": "hidden!important",
                }}
                // inputStr={context.messages.join("\n")}
                // inputStr={context.latest}
                emulatorState={emulatorState}
              />
            );
          }}
        </OutputContext.Consumer>
      </Box>
    );
  }
}
OutputConsole.contextType = OutputContext;

export default OutputConsole;
