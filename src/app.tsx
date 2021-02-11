import React from "react";
import ReactDom from "react-dom";
import BtnRun from "./btnRun";
import Checks from "./checks";
import { MyComponent } from "./cls";
import Output from "./output";
import { deepOrange, orange } from "@material-ui/core/colors";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Header from "./header";
import { Intro } from "./intro";

const mainElement = document.createElement("div");
document.body.appendChild(mainElement);

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: orange[500]
    },
    secondary: {
      main: deepOrange[900]
    }
  }
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <Header />
      <Intro />
      <Checks />
      <BtnRun />
      <Output />
      <MyComponent />
    </ThemeProvider>
  );
};

ReactDom.render(<App />, mainElement);
