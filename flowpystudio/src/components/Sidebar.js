import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import APIClient from "../utils/APIClient";

const useStyles = makeStyles({
  aside: {
    borderRight: "1px solid #eee",
    paddingTop: "calc(15px + 64px)",
    paddingLeft: "10px",
    paddingRight: "10px",
    fontSize: "12px",
    textAlign: "center",
    background: "#faf8fa",
    "@media screen and (min-width: 768px)": {
      maxWidth: "250px",
      minWidth: "150px",
    },
  },
  node: {
    height: "20px",
    padding: "4px",
    border: "1px solid #1a192b",
    borderRadius: "5px",
    marginBottom: "10px",
    marginTop: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "grab",
    backgroundColor: "#ffffff",
  },
  InputNode: {
    borderColor: "#0041d0",
    color: "#0041d0",
  },
  ProcessorNode: {
    borderColor: "#9932cc",
    color: "#9932cc",
  },
  OutputNode: {
    borderColor: "#ff0072",
    color: "#ff0072",
  },
});

const api = APIClient("http://localhost:8321");

export function Sidebar(props) {
  const classes = useStyles();

  const onDragStart = (event, operationDef) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(operationDef)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  const [APIOperations, setAPIOperations] = useState([]);

  useEffect(() => {
    api.operations
      .readAll()
      .then((resp) => resp.json())
      .then((json) => setAPIOperations(json));
  }, []);

  const APINodes = () => {
    return (
      <>
        {APIOperations.map((el) => {
          return (
            <div
              key={`${el.nodeType}.${el.nodeSubtype}`}
              className={`${classes[el.nodeType]} ${classes.node}`}
              onDragStart={(event) => onDragStart(event, el)}
              draggable
            >
              {el.name}
            </div>
          );
        })}
      </>
    );
  };

  return (
    <Paper elevation={3} component="aside" className={classes.aside}>
      <Typography variant="h5">Operations</Typography>
      <APINodes />
    </Paper>
  );
}

export default Sidebar;
