import React from "react";
import { Box, Typography } from "@material-ui/core";
import { HistoryData, HistoryDataItem } from "../lib/runHistory";
import Hash from "./hash";

export type Props = {
  item: HistoryDataItem;

};

export class HistoryRun extends React.Component<Props, never> {
  handleOpen = () => {
    console.log("TODO: open a modal showing the run");
  };

  render() {
    const { item } = this.props;
    const { key, result } = item;

    return (
      <div onClick={this.handleOpen}>
        {key.date} | {key.package} | {key.srtoolImage} | {key.srtoolVersion} |{" "}
        {result.git.tag} <Hash content={result.proposalHash} />
      </div>
    );
  }
}
