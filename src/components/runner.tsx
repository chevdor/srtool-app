import React, { createContext, useContext, useReducer } from "react";
import is from "electron-is";
import { Button } from "@material-ui/core";
import { Runner } from "../lib/runner";
import OutputDataContext, { OutputDataContextDefault } from "./outputData";

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
  const runner = new Runner();
  runner.onData = (data) => {
    update(data.toString());
  };

  const [messages] = useReducer(reducer, []);

  function update(msg: string) {
    messages.push(msg);

    console.log("messages", messages);
    // console.log("latest", latest);
  }

  async function sayHello() {
    console.log("Running docker");

    await runner
      .run()
      .then((result) => {
        console.info("Result", result);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    // <Button color="primary" onClick={sayHello}>
    <Button
      color="primary"
      onClick={async () => {
        await sayHello();
      }}
    >
      Run !
    </Button>
  );
}

export default BtnRun;
