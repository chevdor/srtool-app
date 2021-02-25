import React, { Component } from "react";
import { Message, SRToolResult } from "../lib/message";

export type OutputDataContextContent = {
  messages: string[];
  latest: string;
  result: SRToolResult;
  addMessage: (m: string) => void;
};

export const OutputDataContextDefault = {
  messages: ["Default data"],
  latest: null,
  result: null,
  addMessage: (m: Message) => {
    console.log("addMessage");
  },
};

export const OutputContext = React.createContext(OutputDataContextDefault);
