import React, { createContext } from "react";
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
import { RunnerConfig } from "./runnerConfig";
import { RuntimePackage } from "../types";
import { SettingsContextContent } from "../lib/settings";
import VersionControlSystem, { Service, Tag } from "../lib/vcs";
import { folderBase } from "../constants";
import { assert } from "../lib/assert";

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
  selectedTag: Tag;
  defaultTag: Tag | null;

  packages: RuntimePackage[];
  selectedPackage: RuntimePackage;

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
class RunnerComp extends React.Component<any, State> {
  defaultTag?: Tag;

  constructor(props: never) {
    super(props);
    this.state = {
      tags: [],
      selectedTag: { ref: "refs/tags/v0.8.29" },
      defaultTag: null,

      packages: [],
      selectedPackage: 'polkadot-runtime',

      running: false,
      finished: false,
      includeRc: false,
    };
  }

  run = async (addMessage: (_: Message) => void) => {
    const settings: SettingsContextContent = this.context;
    const runner = new Runner(settings);

    // Prepare & cleanup Cleanup
    await runner.prepare();

    // TODO NOW: can we get a Message instead of a string ?
    runner.onData = (data: string) => {
      addMessage(MessageBuilder.build(data));
    };

    const start = new Date();
    const [service, owner, repo, tag] = [
      "github" as Service,
      "paritytech",
      "polkadot",
      refToName(this.state.selectedTag.ref),
    ];

    this.setState({ running: true });
    const workdir = settings.local.workDir;
    const folder = await runner.fetchSource(service, owner, repo, tag, workdir);
    settings.set("local", "projectPath", folder);
    console.log("project path set to", folder, settings.local);

    try {
      const runnerConfig: RunnerConfig = {
        image: settings.srtool.image,
        package: this.state.selectedPackage,
        folder,
      };
      const result = await runner.run(runnerConfig);
      console.log("Final Result", result);
    } catch (err: any) {
      console.error("We got an error", err);
    }

    this.setState({ finished: true, running: false });

    // We do NOT delete if the user uses his own git repo folder
    // If that's not the case, we check what the users wants from the settings.
    if (settings.local.fetchMode === "httpGet" && settings.local.autoCleanup) {
      
      await runner.cleanup(folder); // TODO WORKDIR: bring back once 100% sure it works
    } else {
      console.log("Skipping cleanup");
    }

    const end = new Date();
    console.log(`Duration: ${(end.getTime() - start.getTime()) / 1000} s`);
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
    if (newPackage) {
      this.setState({ selectedPackage: newPackage });
      // TODO NOW: update store
    }
  };

  async componentDidMount() {
    const svc = new VersionControlSystem("github", "paritytech", "polkadot"); // TODO LATER: fix hardcoded values
    const tags = await svc.getTags();
    const packages = ["polkadot-runtime", "kusama-runtime", "westend-runtime"]; // TODO LATER: fetch the runtime packages from the repo
    this.defaultTag = tags.find((tag: Tag) => tag.ref.indexOf("rc") < 0);

    this.setState({ tags, packages });
  }

  private imageChangedHandler(event: any): void {
    const { value } = event.target;
    console.log(
      `The image has changed into ${value}. Reload for the new image to take effect`
    );
    const settings: SettingsContextContent = this.context;
    console.log("Settings", settings);
    settings.set("srtool", "image", value);
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
                    helperText="Repository Base url"
                    focused={false}
                    defaultValue={settings.repo.baseUrl}
                    disabled={true}
                    style={{ width: "50%" }}
                  ></TextField>
                  <TextField
                    id="project-path"
                    helperText="Project Path"
                    focused={false}
                    defaultValue={settings.local.projectPath}
                    disabled={true}
                    style={{ width: "50%" }}
                  ></TextField>
                  <TextField
                    id="docker-image"
                    helperText="Docker image"
                    focused={false}
                    defaultValue={settings.srtool.image}
                    disabled={process.env.NODE_ENV !== "development"}
                    style={{ width: "50%" }}
                    onBlur={this.imageChangedHandler.bind(this)}
                  ></TextField>
                </FormGroup>

                <FormGroup row>
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
                    defaultValue={this.state.selectedTag}
                    getOptionSelected={(a, b) => a.ref === b.ref}
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

                  <Autocomplete
                    id="package"
                    options={this.state.packages}
                    // getOptionLabel={(package: any) => refToName(tag.ref)}
                    style={{ width: 300 }}
                    onChange={this.setSelectedPackage}
                    disableClearable
                    autoSelect
                    defaultValue="polkadot-runtime"
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        label="Package"
                        variant="standard"
                      />
                    )}
                  />

                  <Button
                    color="primary"
                    onClick={async () => {
                      // TODO: delete the output content on new runs
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

RunnerComp.contextType = SettingsContext;
export default RunnerComp;
