import React from "react";
import { makeStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles({
  argHeader: {
    color: "#888",
    paddingRight: "5px",
  },
});

export const NodeSummary = (props) => {
  const classes = useStyles();
  return (
    <Grid
      container
      direction="column"
      justify="space-between"
      alignItems="flex-start"
    >
      {props.data.args.map((el) => {
        if (el.name === "id") {
          return null;
        } else {
          return (
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="flex-end"
            >
              <Typography variant="body1" className={classes.argHeader}>
                {el.label}
              </Typography>
              <Typography variant="body1" noWrap>
                {el.value}
              </Typography>
            </Grid>
          );
        }
      })}
    </Grid>
  );
};

export default NodeSummary;
