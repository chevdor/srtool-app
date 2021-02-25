import React, { createContext, useContext, useReducer } from "react";
import is from "electron-is";
import { Button } from "@material-ui/core";
import Runner from "../lib/runner";
import {
  OutputDataContextDefault,
  OutputContext,
} from "../contexts/outputContext";
import SettingsContext from "../contexts/settingsContext";
import { Message } from "../lib/message";
const useSettings = () => useContext(SettingsContext);

// function appendOutput(msg) {
//   getCommandOutput().value += msg + "\n";
// }

function showOS() {
  if (is.windows()) console.log("Windows");
  //   appendOutput("Windows Detected.")
  if (is.macOS()) console.log("MacOS");
  // appendOutput("Apple OS Detected.")
  if (is.linux()) console.log("Linux");
  //   appendOutput("Linux Detected.")
}

export const outputDataContext = createContext(OutputDataContextDefault);

function reducer(state: any, message: any) {
  return [...state, message];
}

/**
 * This runner is actually doing the job when the user clicks the button
 */
function BtnRun() {
  const run = async (addMessage: (_: Message) => void) => {
    console.log("Running docker");
    const runner = new Runner();

    runner.onData = (data: string) => {
      addMessage(data.toString()); // TODO: Message Builder here
    };

    await runner
      .run()
      .then((result) => {
        console.info("Final Result", result);
      })
      .catch((err) => console.error);
  };

  return (
    <OutputContext.Consumer>
      {(output) => (
        <Button
          color="primary"
          onClick={async () => {
            await run(output.addMessage);
          }}
        >
          Run !
        </Button>
      )}
    </OutputContext.Consumer>
  );
}

export default BtnRun;
