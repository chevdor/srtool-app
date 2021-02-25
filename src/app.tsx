import React from "react";
import ReactDom from "react-dom";
import { deepOrange, orange } from "@material-ui/core/colors";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Header from "./components/header";
import Init from "./components/init";
import { OutputContext } from "./contexts/outputContext";
import { themes } from "./contexts/themeContext";
import VersionChecker from "./components/versionChecker";
import MainComp from "./components/mainComp";
import StatusContext from "./contexts/statusContext";
import { Beta } from "./components/beta";
import { SRToolResult } from "./lib/message";

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

class App extends React.Component<any, any> {
  toggleTheme: () => void;
  addMessage: (m: string) => void;
  setField: (keyval: Record<string, any>) => void;

  constructor(props: any) {
    super(props);

    this.toggleTheme = () => {
      this.setState((state: any) => ({
        theme: state.theme === themes.dark ? themes.light : themes.dark,
      }));
    };

    this.addMessage = (m: string) => {
      let latest: string | undefined;
      let result: SRToolResult | undefined;
      let getMessages = (messages: any, m: string) => {
        if (m.indexOf("{") < 0) {
          return messages.concat(m);
        } else {
          return messages;
        }
      };

      if (m.indexOf("{") >= 0) {
        result = JSON.parse(m);
      } else {
        latest = m;
      }

      this.setState((state: any) => ({
        output: {
          messages: getMessages(state.output.messages, m),
          latest,
          result,
        },
      }));
    };

    this.setField = (keyval: Record<string, any>) => {
      const { status } = this.state;
      // console.log(`Current context ${JSON.stringify(this.state)} `);
      // console.log(`Setting ${JSON.stringify(keyval)} `);
      // console.log(`Current status ${JSON.stringify(status)} `);

      this.setState(() => ({
        status: { ...status, ...keyval },
      }));
    };

    this.state = {
      output: {
        messages: [],
        latest: null,
        addMessage: this.addMessage,
      },
      status: {
        docker_version: null,
        docker_running: false,
        srtool_version: null,
        srtool_latest: null,
        ready: false,
        setField: this.setField,
      },
    };
  }

  render() {
    return (
      <ThemeProvider theme={darkTheme}>
        <StatusContext.Provider value={this.state.status}>
          <Header />
          <Beta stage="alpha" />
          <OutputContext.Provider value={this.state.output}>
            {/* <VersionChecker /> */}
            <Init visible={!this.state.status.ready} />

            <MainComp visible={this.state.status.ready} />
          </OutputContext.Provider>
        </StatusContext.Provider>
      </ThemeProvider>
    );
  }
}

ReactDom.render(<App />, mainElement);
