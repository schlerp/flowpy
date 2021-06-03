import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import NodeHandles from "./NodeHandles";
import NodeOverlay from "./NodeOverlay";

const useStyles = makeStyles({
  baseNode: {
    width: "180px",
    height: "60px",
    fontSize: "12px",
    color: "#222",
    textAlign: "center",
    background: "#fff",
    // borderWidth: "1px",
    // borderStyle: "solid",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: "10px",
    paddingRight: "10px",
  },
  defaultNode: {
    borderColor: "#000000",
  },
  inputNode: {
    borderLeft: "10px solid #0041d0",
    borderColor: "#0041d0",
  },
  processorNode: {
    borderLeft: "10px solid #9932cc",
    borderColor: "#9932cc",
  },
  outputNode: {
    borderLeft: "10px solid #ff0072",
    borderColor: "#ff0072",
  },
  nodeIdText: {
    fontSize: "6pt",
    color: "#ccc",
    top: "-5px",
    left: "20px",
    position: "fixed",
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
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Typography variant="h6">{props.data.name}</Typography>
        <NodeOverlay {...props} />
      </Grid>
      <NodeHandles {...props} />
      <p className={classes.nodeIdText}>{props.id}</p>
    </div>
  );
};

export default Node;
