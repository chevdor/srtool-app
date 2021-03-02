import React from "react";

export type Props = {
  content: string;
};

export default class Pre extends React.Component<Props, never> {
  render() {
    const { content } = this.props;

    return content ? (
      <code>{content}</code>
    ) : null;
  }
}
