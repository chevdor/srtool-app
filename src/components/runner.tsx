import React, { createContext, useContext, useReducer } from "react";
import is from "electron-is";
import { Button } from "@material-ui/core";
import Runner from "../lib/runner";
import { OutputDataContextDefault, OutputContext } from "../contexts/outputContext";
import SettingsContext from "../contexts/settingsContext";
const useSettings = () => useContext(SettingsContext)

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

function BtnRun() {
  const settings = useSettings()
  const runner = new Runner();
  const [messages] = useReducer(reducer, []);

  async function run(adder: (_: string) => void) {
    console.log("Running docker");

    runner.onData = (data) => {
      adder(data.toString());
    };

    await runner
      .run()
      .then((result) => {
        console.info("Final Result", result);
      })
      .catch((err) => console.error)      
  }

  return (
    // <Button color="primary" onClick={run}>
    <OutputContext.Consumer>
      {(output) => (
        <Button
          color="primary"
          onClick={ async () => {
            await run(output.addMessage);
          }}
          // onClick={() => { output.addMessage('test') } }
        >
          Run !
        </Button>
      )}
    </OutputContext.Consumer>
  );
}

export default BtnRun;
