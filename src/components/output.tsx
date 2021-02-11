import React, { useContext, useDebugValue } from "react";
import { Box, TextField } from "@material-ui/core";
import { createUseStyles } from "react-jss";
import OutputDataContext from "./outputData";

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

function Output() {
  const classes = useStyles();
  // const outputData = useContext(OutputDataContext);
  const contextType = OutputDataContext;

  return (
    <Box className={classes.wrapper}>
      {/* <OutputDataContext.Consumer> */}
        {/* <TextField
          className={classes.output}
          id="outlined-multiline-static-output"
          label="Output"
          multiline
          rows={12}
          defaultValue=" "
          variant="outlined"
          fullWidth={true}
          InputProps={{
            readOnly: true,
          }}
        ></TextField> */}
      {/* </OutputDataContext.Consumer> */}
    </Box>
  );
}

export default Output;
