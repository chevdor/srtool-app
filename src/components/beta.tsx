import React, { Component } from "react";
import { Alert, AlertTitle } from "@material-ui/lab";
import { shell } from "electron";

export type BetaProps = {
  stage?: "alpha" | "beta";
};

/**
 * This component does not show in development but shows a warning
 * if the stage prop is set to beta or alpha.
 */
export class Beta extends React.Component<BetaProps, any> {
  render() {
    const { stage } = this.props;

    if ((stage === "alpha" || stage === "beta") && process.env.NODE_ENV !== "development")
      return (
        <Alert severity="error" color="error">
          <AlertTitle>!!! {stage} version !!!</AlertTitle>
          This is {stage === "alpha" ? "an" : "a"} {stage} version. Bugs are to
          be expected and you can greatly help simply by reporting them. If you
          run into an issue, please &nbsp;
          <a
            style={{ textDecoration: "underline", fontWeight: 900 }}
            color="primary"
            aria-label="Report issue"
            onClick={() =>
              shell.openExternal(
                "https://gitlab.com/chevdor/srtool-app/-/issues"
              )
            }
          >
            report an issue
          </a>
          .
        </Alert>
      );
    else return null;
  }
}
