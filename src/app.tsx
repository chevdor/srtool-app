import React from "react";
import ReactDom from "react-dom";
import { deepOrange, orange } from "@material-ui/core/colors";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import {
  OutputContext,
  OutputDataContextContent,
} from "./contexts/outputContext";
import { Theme, themes } from "./contexts/themeContext";
import { Beta } from "./components/beta";
import { isResult, Message, SRToolResult } from "./lib/message";
import Init from "./components/init";
import Header from "./components/header";
import MainComp from "./components/mainComp";
import StatusContext, { StatusContextContent } from "./contexts/statusContext";
import { AppStorage } from "./types";
import Store from "electron-store";
import { defaultSettings, SettingsContextContent } from "./lib/settings";
import SettingsContext from "./contexts/settingsContext";
import pkg from "../package.json";
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

export type State = {
  theme: Theme;
  output: OutputDataContextContent;
  status: StatusContextContent;
  settings: SettingsContextContent;
};

class App extends React.Component<any, any> {
  toggleTheme: () => void;
  addMessage: (m: Message) => void;
  setField: (keyval: Record<string, any>) => void;
  setSetting: (section: string, key: string, value: any) => void;

  constructor(props: never) {
    super(props);

    this.toggleTheme = () => {
      this.setState((state: State) => ({
        theme: state.theme === themes.dark ? themes.light : themes.dark,
      }));
    };

    this.addMessage = (m: Message) => {
      let latest: Message | undefined;
      let result: SRToolResult | undefined;

      let getMessages = (messages: Message[], m: Message) => {
        if (!isResult(m.content)) {
          return messages.concat(m);
        } else {
          return messages;
        }
      };

      if (isResult(m.content)) {
        result = m.content;
      } else {
        latest = m;
      }

      this.setState((state: State) => ({
        output: {
          messages: getMessages(state.output.messages, m),
          joinedMessages:
            state.output.joinedMessages +
            (isResult(m.content) ? "" : `${m.content}\n`),
          latest,
          result,
          addMessage: this.addMessage,
        },
      }));
    };

    const store = new Store<AppStorage>({
      defaults: {
        history: [],
        settings: defaultSettings,
      },
    });
    //store.clear();
    console.log(`Starting ${pkg.name} v${pkg.version}`);
    console.log("appstorage", store);
    console.log(`Your config is located at ${store.path}`);
    console.log(`App WorkDir set at ${store.store.settings.local.workDir}`);

    this.setSetting = (section: string, key: string, value: any) => {
      console.log(`Setting settings.${section}.${key} to ${value}`);
      const settingKey = `settings.${section}.${key}`;
      store.set(settingKey, value);
      let settings = this.state.settings;
      settings[section][key] = value;

      this.setState(() => ({
        settings,
      }));
      console.log("state is now", this.state);
    };

    this.setField = (keyval: Record<string, any>) => {
      const { status } = this.state;
      this.setState(() => ({
        status: { ...status, ...keyval },
      }));
    };

    this.state = {
      output: {
        messages: [],
        latest: null,
        addMessage: this.addMessage,
        joinedMessages: "",
      },
      status: {
        docker_version: null,
        docker_running: false,
        srtool_version: null,
        srtool_latest: null,
        ready: false,
        setField: this.setField,
      },
      settings: {
        ...store.store.settings,
        set: this.setSetting,
      },
    };

    console.log("state", this.state);
  }

  render() {
    return (
      <ThemeProvider theme={darkTheme}>
        <StatusContext.Provider value={this.state.status}>
          <SettingsContext.Provider value={this.state.settings}>
            <Header />
            <Beta stage="alpha" />
            <OutputContext.Provider value={this.state.output}>
              {/* <VersionChecker /> */}

              <Init
                visible={!this.state.status.ready}
                settings={this.state.settings}
              />
              <MainComp visible={this.state.status.ready} />
            </OutputContext.Provider>
          </SettingsContext.Provider>
        </StatusContext.Provider>
      </ThemeProvider>
    );
  }
}

ReactDom.render(<App />, mainElement);
