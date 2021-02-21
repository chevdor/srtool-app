import React from "react";

const StatusContext = React.createContext({
  docker: {
    version: "1.2.3", // null means we found no docker
    running: true,
  },
  srtool: {
      version: "0.9.5",
  },
  toggleDocker: () => {},
});

export default StatusContext;
