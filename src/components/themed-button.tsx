import React from "react";
import { ThemeContext } from "../contexts/themeContext";

class ThemedButton extends React.Component<any, any> {
  render() {
    let props = this.props;
    let theme = this.context;
    return <button {...props} style={{ backgroundColor: theme.background }} />;
  }
}
ThemedButton.contextType = ThemeContext;

export default ThemedButton;
