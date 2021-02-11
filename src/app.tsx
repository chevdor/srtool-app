import React from "react";
import ReactDom from "react-dom";
import BtnRun from "./components/runner";
import Output from "./components/output";
import { deepOrange, orange } from "@material-ui/core/colors";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Header from "./components/header";
import Checks from "./components/checks";
import { Intro } from "./components/intro";
import OutputDataContext, { OutputDataContextDefault } from "./components/outputData";

const mainElement = document.createElement("div");
document.body.appendChild(mainElement);

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: orange[500],
    },
    secondary: {
      main: deepOrange[900],
    },
  },
});

const outputData = OutputDataContextDefault;

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <OutputDataContext.Provider value={outputData}>
        <Header />
        <Intro />
        <Checks />
        <BtnRun />
        <Output />
      </OutputDataContext.Provider>
    </ThemeProvider>
  );
};

ReactDom.render(<App />, mainElement);
