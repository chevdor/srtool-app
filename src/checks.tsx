import React, { useEffect } from "react";
import is from "electron-is";

function Checks() {
    
  useEffect(() => {
    run();

    console.log("mount it!");
  }, []);

  function run() {
    let spawn = require("child_process").spawn;
    console.log("start");
    let bat = spawn("bash", ["-c", "docker --version"]);

    bat.stdout.on("data", (data: any) => {
      console.log(data.toString());
    });

    bat.stderr.on("data", (err: any) => {
      console.log(err.toString());
    });

    bat.on("exit", (code: any) => {
      console.log(code);
    });
  }

  return (<span></span>);
}

export default Checks;
