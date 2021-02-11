import { createContext } from 'react';

export type OutputDataContextContent = {
    messages: string[];
    // latest: string;
    // addMessage: (m: string) => void;
}

export const OutputDataContextDefault = {
    messages: [],
    // latest: '',
}

// addMessage: function (msg: string) {
//     this.messages.push(msg);
// },
const OutputDataContext = createContext<OutputDataContextContent>(OutputDataContextDefault);

export default OutputDataContext;
