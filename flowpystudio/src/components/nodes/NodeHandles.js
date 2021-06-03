import { Handle } from "react-flow-renderer";

export const NodeHandles = (props) => {
  if (props.type === "InputNode") {
    return (
      <Handle
        type="source"
        position="right"
        id={`sourcehandle__${props.data.nodeType}.${props.data.nodeSubtype}.${props.id}`}
        style={{ top: "50%", background: "#555" }}
      />
    );
  } else if (props.type === "OutputNode") {
    return (
      <Handle
        type="target"
        position="left"
        id={`targethandle__${props.nodeType}.${props.data.nodeSubtype}.${props.id}`}
        style={{ top: "50%", background: "#555" }}
      />
    );
  } else {
    return (
      <>
        <Handle
          type="target"
          position="left"
          id={`targethandle__${props.data.nodeType}.${props.data.nodeSubtype}.${props.id}`}
          style={{ top: "50%", background: "#555" }}
        />
        <Handle
          type="source"
          position="right"
          id={`sourcehandle__${props.data.nodeType}.${props.data.nodeSubtype}.${props.id}`}
          style={{ top: "50%", background: "#555" }}
        />
      </>
    );
  }
};

export default NodeHandles;
