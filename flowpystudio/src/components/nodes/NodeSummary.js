import React from "react";
import { makeStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CheckIcon from "@material-ui/icons/Check";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";

const useStyles = makeStyles({
  argHeader: {
    color: "#888",
    paddingRight: "5px",
  },
});

function boolToString(val) {
  console.log(val);
  if (val === true) {
    return <CheckIcon />;
  } else if (val === false) {
    return <CheckBoxOutlineBlankIcon />;
  } else {
    return "derp";
  }
}

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
        console.log(el);
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
