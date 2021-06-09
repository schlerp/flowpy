import React, { useEffect, useState, useCallback } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DonutSmallIcon from "@material-ui/icons/DonutSmall";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/styles";
import Drawer from "@material-ui/core/Drawer";
import APIClient from "../utils/APIClient";

const useStyles = makeStyles({
  appbar: {
    zIndex: 10,
  },
  drawer: {
    width: 200,
    textAlign: "center",
  },
});

const api = APIClient("http://localhost:8321");

export const TopBar = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [flows, setFlows] = useState([]);

  const refreshFlows = useCallback(() => {
    api.flows
      .readAll()
      .then((resp) => {
        return resp.json();
      })
      .then((json) => {
        console.log(json);
        return setFlows(json);
      });
  }, []);

  useEffect(() => {
    refreshFlows();
  }, [refreshFlows]);

  const handleDrawerOpen = () => {
    refreshFlows();
    setOpen(true);
  };

  const toggleDrawer = (openValue) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(openValue);
  };

  const onClickFlow = (flowId) => {
    props.setFlowId(flowId);
  };

  return (
    <AppBar position="absolute" className={classes.appbar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
        >
          <MenuIcon />
        </IconButton>
        <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
          <div
            className={classes.drawer}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <Typography variant="h6">Flows</Typography>
            <List>
              {flows.map((flow, index) => (
                <ListItem
                  button
                  key={flow.id}
                  onClick={() => onClickFlow(flow.id)}
                >
                  <ListItemIcon>
                    <DonutSmallIcon />
                  </ListItemIcon>
                  <ListItemText primary={flow.id} />
                </ListItem>
              ))}
            </List>
          </div>
        </Drawer>
        <Typography variant="h6">{props.mainTitle}</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
