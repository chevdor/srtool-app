import React from "react";
import { HistoryDataItem } from "../lib/runHistory";
import Hash from "./hash";

export type Props = {
  item: HistoryDataItem;
};

// TODO LATER: Open a modal showing the run result
export class HistoryRun extends React.Component<Props, never> {
  handleOpen = () => {};

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
