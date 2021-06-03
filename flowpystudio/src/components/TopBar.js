import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

export const TopBar = (props) => {
  return (
    <AppBar position="absolute">
      <Toolbar>
        <Typography variant="h6">{props.mainTitle}</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
