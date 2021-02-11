import React from "react";
import is from "electron-is";
import { Button } from "@material-ui/core";
import { Runner } from "./lib/runner";

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

function BtnRun() {
  const runner = new Runner();

  function sayHello() {
    console.log("Running docker");
    const result = runner.run();

    console.info('Result', result);
  }

  return (
    <Button color="primary" onClick={sayHello}>
      Click me!
    </Button>
  );
}

export default BtnRun;
