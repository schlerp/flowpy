import React, { useState } from "react";
import { ReactFlowProvider } from "react-flow-renderer";
import { makeStyles } from "@material-ui/core/styles";
import TopBar from "./components/TopBar";
import FlowDesigner from "./components/FlowDesigner";
import getId from "./utils/getId";

const useStyles = makeStyles({
  app: {
    height: "100%",
  },
});

const App = () => {
  const classes = useStyles();
  const [flowId, setFlowId] = useState(getId());
  return (
    <ReactFlowProvider>
      <div className={classes.app}>
        <TopBar mainTitle="FlowPy" setFlowId={setFlowId} />
        <FlowDesigner flowId={flowId} />
      </div>
    </ReactFlowProvider>
  );
};

export default App;
