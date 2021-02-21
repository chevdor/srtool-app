import React, { useContext, useDebugValue } from "react";
import { Box, TextField } from "@material-ui/core";
import { createUseStyles } from "react-jss";
import {
  // OutputContextConsumer,
  // OutputContextProvider,
  OutputContext, OutputDataContextContent,
} from "../contexts/outputContext";
// const useOutput = () => useContext(OutputContextProvider);

const useStyles = createUseStyles({
  wrapper: {
    padding: [10, 10],
    textAlign: "right",
    // border: "2px solid red",
  },
  output: {
    background: "#2f752a0a",
    borderRadius: "3px",
    // border: "2px solid red",
  },
});

class Output extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }
  
  // componentDidUpdate(props?: any) {
  //   this.scrollToBottom();

  // }
  
  // const classes = useStyles();
  // const outputData = useContext(OutputDataContext);
  // const contextType = OutputDataContext;
  // const output = useOutput();
  // console.log("output", output);
  render() {
    let props = this.props;
    let context = this.context;
    // console.log('TRACE', context);
    
    return (
      // <Box className={classes.wrapper}>
      <Box >
        <OutputContext.Consumer>
          {(context: any) => (
            <TextField
              id="outlined-multiline-static-output"
              label="Output"
              multiline
              rows={10}
              // defaultValue=" "
              variant="outlined"
              fullWidth={true}
              InputProps={{
                readOnly: true,
              }}
              value={context.messages.join('\n')}
              // rowsMin={6} 
              
            >
              
            </TextField>
          )}
        </OutputContext.Consumer>
      </Box>
    );
  }
}
Output.contextType= OutputContext;

export default Output;
