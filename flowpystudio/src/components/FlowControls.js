import React from "react";
import { Controls, ControlButton } from "react-flow-renderer";
import SaveIcon from "@material-ui/icons/Save";
import FolderIcon from "@material-ui/icons/Folder";

export const FlowControls = (props) => {
  return (
    <Controls>
      <ControlButton onClick={props.onSave}>
        <SaveIcon />
      </ControlButton>
      <ControlButton onClick={props.onRestore}>
        <FolderIcon />
      </ControlButton>
    </Controls>
  );
};

export default FlowControls;
