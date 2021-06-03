import React from "react";
import { ReactFlowProvider } from "react-flow-renderer";
import { makeStyles } from "@material-ui/core/styles";
import TopBar from "./components/TopBar";
import FlowDesigner from "./components/FlowDesigner";

const useStyles = makeStyles({
  app: {
    height: "100%",
  },
});

const App = () => {
  const classes = useStyles();
  return (
    <ReactFlowProvider>
      <div className={classes.app}>
        <TopBar mainTitle="FlowPy" />
        <FlowDesigner flowKey="12345" />
      </div>
    </ReactFlowProvider>
  );
};

export default App;
