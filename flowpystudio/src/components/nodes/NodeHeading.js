import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import NodeOverlay from "./NodeOverlay";

export const NodeHeading = (props) => {
  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      spacing={1}
    >
      <Typography variant="h5">{props.data.name}</Typography>
      <NodeOverlay {...props} />
    </Grid>
  );
};

export default NodeHeading;
