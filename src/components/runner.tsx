import React, { createContext, useContext } from "react";
import is from "electron-is";
import { Box, Button, TextField } from "@material-ui/core";
import Runner from "../lib/runner";
import {
  OutputDataContextDefault,
  OutputContext,
} from "../contexts/outputContext";
import SettingsContext from "../contexts/settingsContext";
import { Message, MessageBuilder } from "../lib/message";
import { Autocomplete } from "@material-ui/lab";
import SourceVersionControl, { Tag } from "../lib/svc";

function showOS() {
  if (is.windows()) console.log("Windows");
  //   appendOutput("Windows Detected.")
  if (is.macOS()) console.log("MacOS");
  // appendOutput("Apple OS Detected.")
  if (is.linux()) console.log("Linux");
  //   appendOutput("Linux Detected.")
}

export const outputDataContext = createContext(OutputDataContextDefault);


export type State = {
  tags: Tag[],
}

/**
 * This runner is actually doing the job when the user clicks the button
 */
export default class BtnRun extends React.Component<never, State> {
  state = {
    tags: []
  }

  // function BtnRun() {
  run = async (addMessage: (_: Message) => void) => {
    console.log("Running docker");
    const runner = new Runner();

    runner.onData = (data: string) => {
      addMessage(MessageBuilder.build(data));
    };

    const start = new Date();
    await runner
      .run()
      .then((result) => {
        console.info("Final Result", result);
      })
      .catch((_err) => console.error);
    const end = new Date();
    console.log(`Duration: ${end.getTime() - start.getTime()} ms`);
  };

  async componentDidMount() {
    const svc = new SourceVersionControl("github", "paritytech", "polkadot"); // TODO: fix hardcoded values
    const tags = await svc.getTags();
    this.setState({ tags });
  }

  render() {
    return (
      <SettingsContext.Consumer>
        {(settings) => (
          <OutputContext.Consumer>
            {(output) => (
              <Box>
                <TextField
                  id="base-url"
                  helperText="repo base url"
                  focused={false}
                  defaultValue={settings.repo.baseUrl}
                  fullWidth={true}
                  disabled={true}
                ></TextField>

                {/* <TextField
                id="tag"
                helperText="tag / version"
                focused={true}
                fullWidth={true}
              ></TextField> */}

                <Autocomplete
                  id="tag"
                  options={this.state.tags}
                  getOptionLabel={(tag: Tag) => tag.ref.replace('refs/tags/', '')}
                  style={{ width: 300 }}
                  renderInput={(params: any) => (
                    <TextField {...params} label="Tag" variant="standard" />
                  )}
                />

                <Button
                  color="primary"
                  onClick={async () => {
                    await this.run(output.addMessage);
                  }}
                >
                  Run !
                </Button>
              </Box>
            )}
          </OutputContext.Consumer>
        )}
      </SettingsContext.Consumer>
    );
  }
}
// export default BtnRun;
