import React from "react";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import NodeHeading from "./NodeHeading";
import NodeSummary from "./NodeSummary";
import NodeHandles from "./NodeHandles";

const useStyles = makeStyles({
  baseNode: {
    maxWidth: "250px",
    minHeight: "70px",
    fontSize: "12px",
    color: "#222",
    textAlign: "center",
    background: "#fff",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: "10px",
    paddingRight: "10px",
    paddingTop: "5px",
    paddingBottom: "5px",
    boxShadow: "2px 2px 5px grey",
  },
  defaultNode: {
    borderColor: "#000000",
  },
  inputNode: {
    borderLeft: "22px solid #0041d0",
    borderColor: "#0041d0",
  },
  processorNode: {
    borderLeft: "22px solid #9932cc",
    borderColor: "#9932cc",
  },
  outputNode: {
    borderLeft: "22px solid #ff0072",
    borderColor: "#ff0072",
  },
  nodeIdText: {
    fontSize: "6pt",
    color: "#ccc",
    top: "0px",
    left: "20px",
    position: "fixed",
    transformOrigin: "0 0",
    transform: "rotate(270deg) scaleX(-1) scaleY(-1)",
  },
});

export const Node = (props) => {
  const classes = useStyles();
  let nodeClass = classes.defaultNode;
  if (props.type === "InputNode") {
    nodeClass = classes.inputNode;
  } else if (props.type === "ProcessorNode") {
    nodeClass = classes.processorNode;
  } else if (props.type === "OutputNode") {
    nodeClass = classes.outputNode;
  }

  return (
    <div className={`${classes.baseNode} ${nodeClass}`}>
      <Grid
        container
        direction="column"
        justify="space-around"
        alignItems="center"
      >
        <NodeHeading {...props} />
        <NodeSummary {...props} />
      </Grid>
      <NodeHandles {...props} />
      <p className={classes.nodeIdText}>{props.id}</p>
    </div>
  );
};

export default Node;
