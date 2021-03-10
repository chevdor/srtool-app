import React, { createContext, useContext } from "react";
import is from "electron-is";
import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
} from "@material-ui/core";
import Runner from "../lib/runner";
import {
  OutputDataContextDefault,
  OutputContext,
} from "../contexts/outputContext";
import SettingsContext from "../contexts/settingsContext";
import { Message, MessageBuilder } from "../lib/message";
import { Autocomplete, AutocompleteChangeReason } from "@material-ui/lab";
import VersionControlSystem, { Service, Tag } from "../lib/vcs";
import { RunnerConfig } from "./runnerConfig";
import { RuntimePackage } from "../types";

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
  tags: Tag[];
  selectedTag: Tag | null;
  defaultTag: Tag | null;

  packages: RuntimePackage[];
  selectedPackage: RuntimePackage | null;

  running: boolean;
  finished: boolean;
  includeRc: boolean;
};

/**
 * tranform refs such as `refs/tags/v1.2.3` into `v1.2.3`
 * @param ref The original ref
 */
function refToName(ref: string): string {
  return ref.replace("refs/tags/", "");
}

/**
 * This runner is actually doing the job when the user clicks the button
 */
export default class RunnerComp extends React.Component<any, State> {
  defaultTag?: Tag;

  constructor(props: never) {
    super(props);
    this.state = {
      tags: [],
      selectedTag: null,
      defaultTag: null,

      packages: [],
      selectedPackage: null,

      running: false,
      finished: false,
      includeRc: false,
    };
  }

  /**
   * If everything went according to plan, this function should never have anything to do.
   * If some srtool container was left behind however, we delete it before it causes issues.
   */
  async deleteSrtoolContainer():Promise<void> {
    console.log('Deleting old `srtool` container if any can be found');
    // TODO: Implement that
    
  }

  // TODO: add a call to a new cleanup function that effectively stop any running srtool

  // function BtnRun() {
  run = async (addMessage: (_: Message) => void) => {
    console.log("Running docker");
    this.setState({ running: true });
    const runner = new Runner();

    runner.onData = (data: string) => {
      addMessage(MessageBuilder.build(data));
    };

    const start = new Date();
    const [service, owner, repo, tag] = [
      "github" as Service,
      "paritytech",
      "polkadot",
      "v0.8.28",
    ];

    const workdir = "/tmp/srtool"; // TODO: use workdir instead
    const folder = await runner.fetchSource(service, owner, repo, tag, workdir);
    // TODO: now set our src workdir to `folder`

    // TODO: Fix args
    try {
      const result = await runner.run(RunnerConfig.srtool_2021_02_25);
      console.info("Final Result", result);
    } catch (err: any) {
      console.error(err);
    }

    this.setState({ finished: true, running: false });

    await deleteSrtoolContainer();

    if (false) {
      await runner.cleanup(folder); // TODO: only do according to the settings
    } else {
      console.log("Skipping cleanup");
    }

    const end = new Date();
    console.log(`Duration: ${end.getTime() - start.getTime()} ms`);
  };

  setSelectedTag = (
    event: any,
    newTag: Tag | null,
    reason: AutocompleteChangeReason
  ) => {
    if (newTag) this.setState({ selectedTag: newTag });
  };

  setSelectedPackage = (
    event: any,
    newPackage: RuntimePackage | null,
    reason: AutocompleteChangeReason
  ) => {
    if (newPackage) this.setState({ selectedPackage: newPackage });
  };

  async componentDidMount() {
    const svc = new VersionControlSystem("github", "paritytech", "polkadot"); // TODO: fix hardcoded values
    const tags = await svc.getTags();
    const packages = ["polkadot-runtime", "kusama-runtime", "westend-runtime"]; // TODO: fetch the runtime packages from the repo
    this.defaultTag = tags.find((tag: Tag) => tag.ref.indexOf("rc") < 0);

    this.setState({ tags, packages });
  }

  render() {
    const handleRcChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({ includeRc: event.target.checked });
    };

    return (
      <SettingsContext.Consumer>
        {(settings) => (
          <OutputContext.Consumer>
            {(output) => (
              <Box>
                <FormGroup row>
                  <TextField
                    id="base-url"
                    helperText="repo base url"
                    focused={false}
                    defaultValue={settings.repo.baseUrl}
                    disabled={true}
                    style={{ width: "50%" }}
                  ></TextField>
                  <TextField
                    id="base-url"
                    helperText="repo base url"
                    focused={false}
                    defaultValue={settings.local.projectPath}
                    // fullWidth={true}
                    disabled={true}
                    style={{ width: "50%" }}
                  ></TextField>
                </FormGroup>

                <FormGroup row>
                  <Autocomplete
                    id="package"
                    options={this.state.packages}
                    // getOptionLabel={(package: any) => refToName(tag.ref)}
                    style={{ width: 300 }}
                    onChange={this.setSelectedPackage}
                    disableClearable
                    autoSelect
                    defaultValue="kusama-runtime"
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        label="Package"
                        variant="standard"
                      />
                    )}
                  />
                  <Autocomplete
                    id="tag"
                    options={this.state.tags.filter(
                      (tag: Tag) =>
                        tag.ref.indexOf("rc") < 0 ||
                        (this.state.includeRc && tag.ref.indexOf("rc") >= 0)
                    )}
                    getOptionLabel={(tag: Tag) => refToName(tag.ref)}
                    style={{ width: 300 }}
                    onChange={this.setSelectedTag}
                    disableClearable
                    autoSelect
                    renderInput={(params: any) => (
                      <TextField {...params} label="Tag" variant="standard" />
                    )}
                  />

                  <FormControlLabel
                    style={{ color: "white" }}
                    control={
                      <Switch
                        checked={this.state.includeRc}
                        onChange={handleRcChange}
                        name="includeRc"
                        inputProps={{ "aria-label": "secondary checkbox" }}
                      />
                    }
                    label="Include RC"
                  />

                  <Button
                    color="primary"
                    onClick={async () => {
                      await this.run(output.addMessage);
                    }}
                    disabled={!this.state.selectedTag || this.state.running}
                  >
                    {!this.state.selectedTag
                      ? "Select a tag"
                      : `Run for ${refToName(this.state.selectedTag.ref)}`}
                  </Button>
                </FormGroup>
              </Box>
            )}
          </OutputContext.Consumer>
        )}
      </SettingsContext.Consumer>
    );
  }
}
