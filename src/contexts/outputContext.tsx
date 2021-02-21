import React, { Component } from "react";
import { Message } from "../lib/message";

export type OutputDataContextContent = {
    messages: string[];
    latest: string;
    addMessage: (m: string) => void;
}

export const OutputDataContextDefault = {
    messages: ['Default data'],
    latest: null,
    addMessage: (m: Message) => {
        console.log('addMessage') 
    }
}

export const OutputContext = React.createContext(OutputDataContextDefault);

// const { Provider, Consumer } = context;

// class OutputContextProvider extends Component {
//     // state = {
//     //     messages: OutputDataContextDefault.messages,
//     //     addMessage: OutputDataContextDefault.addMessage,
//     // }
//     state = {
//         messages: [],
//         addMessage: (m: string) => {
//             console.log('addMessage2') 
//         }
//     }

//     addMessage = (m: string) => {
//         console.log('Adding message')
//         this.setState((prevState: OutputDataContextContent) => {
            
//             return {
//                 messages: prevState.messages.concat(m)
//             };
//         });
//     };
    
//     render() {
//         return (
//             <Provider value={{ messages: this.state.messages, addMessage: this.state.addMessage }}>
//                 {this.props.children}
//             </Provider>
//         );
//     }
// }

// export { OutputContextProvider, Consumer as OutputContextConsumer };

// -----------------------


// addMessage: function (msg: string) {
//     this.messages.push(msg);
// },
// const OutputDataContext = createContext<OutputDataContextContent>(OutputDataContextDefault);

// export default OutputDataContext;
