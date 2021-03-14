import React from "react";
import { Message, SRToolResult } from "../lib/message";

export type OutputDataContextContent = {
  messages: Message[];
  latest: Message;
  result: SRToolResult;
  joinedMessages: string; // this is to prevent having to re-join the messages array every time
  addMessage: (m: string) => void;
};

export const OutputDataContextDefault = {
  messages: new Array(1024),
  latest: null,
  result: null,
  joinedMessages: "",
  addMessage: (m: Message) => {
    console.log("addMessage");
  },
};

export const OutputContext = React.createContext(OutputDataContextDefault);
