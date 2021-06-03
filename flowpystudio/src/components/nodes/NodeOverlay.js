import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import SettingsIcon from "@material-ui/icons/Settings";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import { DelayInput } from "react-delay-input";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import FormGroup from "@material-ui/core/FormGroup";
import Grid from "@material-ui/core/Grid";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalPaper: {
    padding: "10px",
    textAlign: "center",
  },
  formTitle: {
    textAlign: "center",
  },
  nodeIdText: {
    fontSize: "6pt",
    color: "#ccc",
    bottom: "5px",
    right: "15px",
    position: "fixed",
  },
  InputNode: {
    borderLeft: "10px solid #0041d0",
    borderColor: "#0041d0",
  },
  ProcessorNode: {
    borderLeft: "10px solid #9932cc",
    borderColor: "#9932cc",
  },
  OutputNode: {
    borderLeft: "10px solid #ff0072",
    borderColor: "#ff0072",
  },
}));

export const NodeOverlay = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("form submission: ", e);
  };

  const nodeForm = props.data.args.map((el) => {
    if (el.name === "id") {
      return null;
    }
    if (el.type === "text") {
      return (
        <DelayInput
          element={TextField}
          delayTimeout={300}
          id={`input_${el.name}.${props.id}`}
          key={`input_${el.name}.${props.id}`}
          label={el.label}
          onChange={(e) => props.data.updateNode(e, props.id, el.name, el.type)}
          value={el.value}
        />
      );
    } else if (el.type === "bool") {
      return (
        <FormControlLabel
          key={`label_${el.name}.${props.id}`}
          value={el.label}
          control={
            <Checkbox
              id={`checkbox_${el.name}.${props.id}`}
              key={`checkbox_${el.name}.${props.id}`}
              color="primary"
              onChange={(e) =>
                props.data.updateNode(e, props.id, el.name, el.type)
              }
              checked={el.value}
            />
          }
          label={el.label}
          labelPlacement="end"
        />
      );
    } else {
      return null;
    }
  });

  return (
    <>
      <IconButton onClick={handleOpen}>
        <SettingsIcon />
      </IconButton>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Paper className={`${classes.modalPaper} ${classes[props.type]}`}>
            <form onSubmit={handleSubmit}>
              <Grid container direction="row" justify="space-between">
                <Typography variant="h4" className={classes.formTitle}>
                  {props.data.name}
                </Typography>
                <IconButton onClick={(event) => props.data.runNode(props)}>
                  <PlayCircleOutlineIcon />
                </IconButton>
              </Grid>
              <FormGroup>{nodeForm}</FormGroup>
            </form>
            <p className={classes.nodeIdText}>{props.id}</p>
          </Paper>
        </Fade>
      </Modal>
    </>
  );
};

export default NodeOverlay;
