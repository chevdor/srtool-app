import React from "react";
import ReactDom from "react-dom";
import { deepOrange, orange } from "@material-ui/core/colors";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Output from "./components/output";
import Runner from "./components/runner";
import Header from "./components/header";
import Init from "./components/init";
import { Intro } from "./components/intro";
import {
  // OutputDataContextDefault,
  OutputContext,
  // OutputContextProvider,
  // OutputContextConsumer,
} from "./contexts/outputContext";
import { themes } from "./contexts/themeContext";
import SrtoolResultComp from "./components/result";
import Latest from "./components/latest";
import Verif from "./components/verif";
import VersionChecker from "./components/versionChecker";

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

type AppState = { foreground: string; background: string };

class App extends React.Component<any, any> {
  toggleTheme: () => void;
  addMessage: (m: string) => void;

  constructor(props: any) {
    super(props);

    this.toggleTheme = () => {
      this.setState((state: any) => ({
        theme: state.theme === themes.dark ? themes.light : themes.dark,
      }));
    };

    this.addMessage = (m: string) => {
      this.setState((state: any) => ({
        output: {
          messages: state.output.messages.concat(m),
          latest: m,
        },
      }));
    };

    this.state = {
      output: {
        messages: [],
        latest: null,
        addMessage: this.addMessage,
      },
    };
  }

  render() {
    return (
      <ThemeProvider theme={darkTheme}>
        <OutputContext.Provider value={this.state.output}>
          <Header />
          <VersionChecker />
          {/* <ResponsiveDrawer/> */}
          {/* <Intro /> */}
          <Init />
          <Runner />
          <Output />
          <Latest />
          <SrtoolResultComp />
          <Verif />
        </OutputContext.Provider>
      </ThemeProvider>
    );
  }
}

ReactDom.render(<App />, mainElement);
