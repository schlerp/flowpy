import React, { useState, useRef, useCallback, memo, useEffect } from "react";
import ReactFlow, {
  addEdge,
  updateEdge,
  removeElements,
  Background,
  MiniMap,
  useZoomPanHelper,
} from "react-flow-renderer";
import getId from "../utils/getId";
import { makeStyles } from "@material-ui/core/styles";
import Node from "./nodes/Node";
import APIClient from "../utils/APIClient";
import Sidebar from "./Sidebar";
import FlowControls from "./FlowControls";

const useStyles = makeStyles({
  flowwrapper: {
    flexGrow: 1,
    height: "calc(100% - 64px)",
    marginTop: "64px",
  },
  flowdesigner: {
    flexDirection: "column",
    display: "flex",
    height: "100%",
    "@media screen and (min-width: 768px)": {
      flexDirection: "row",
    },
  },
  baseNode: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  designerBackground: {
    backgroundColor: "#efefef",
  },
});

const nodeTypes = {
  InputNode: Node,
  ProcessorNode: Node,
  OutputNode: Node,
};

const api = APIClient("http://localhost:8321");

const FlowDesigner = memo((props) => {
  const classes = useStyles();
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [elements, setElements] = useState([]);
  const onConnect = (params) =>
    setElements((els) => {
      console.log("onConnect:", params, els);
      return addEdge(params, els);
    });
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => {
      console.log("onElementsRemove", elementsToRemove, els);
      return removeElements(elementsToRemove, els);
    });

  const onEdgeUpdate = (oldEdge, newConnection) =>
    setElements((els) => {
      console.log("onEdgeUpdate", oldEdge, newConnection, els);
      return updateEdge(oldEdge, newConnection, els);
    });

  const onLoad = (_reactFlowInstance) =>
    setReactFlowInstance(_reactFlowInstance);

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const updateNode = (event, nodeId, fieldName, fieldType) => {
    setElements((els) =>
      els.map((e) => {
        if (e.id === nodeId) {
          e.data.args.forEach((arg, index) => {
            if (arg.name === fieldName) {
              if (fieldType === "text") {
                e.data.args[index].value = event.target.value;
              } else if (fieldType === "bool") {
                e.data.args[index].value = event.target.checked;
              }
            }
          });
        }
        return e;
      })
    );
  };

  const runNode = (node) => {
    console.log(node);
    const flow = reactFlowInstance.toObject();
    const flowDefinition = { id: props.flowKey, ...flow };
    // TODO: create = post, should rename
    api.nodes.create({
      uniqueId: node.id,
      nodeType: node.data.nodeType,
      nodeSubtype: node.data.nodeSubtype,
      name: node.data.name,
      args: node.data.args.filter((arg) => {
        if (arg.name !== "id") {
          return true;
        }
        return false;
      }),
    });
    const runResult = api.nodes.command("run", {
      uniqueId: node.id,
      flow: flowDefinition,
    });
    runResult.then((data) => console.log(data));
  };

  const onDrop = (event) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    const operationDef = JSON.parse(
      event.dataTransfer.getData("application/reactflow")
    );
    const uniqueId = getId();

    const nodeRunMetaData = async () =>
      await api.nodes.create({
        uniqueId: uniqueId,
        nodeType: operationDef.nodeType,
        nodeSubtype: operationDef.nodeSubtype,
        name: operationDef.name,
        args: operationDef.args.filter((arg) => {
          if (arg.name !== "id") {
            return true;
          }
          return false;
        }),
      });

    const newNode = {
      id: uniqueId,
      type: operationDef.nodeType,
      position,
      className: classes.baseNode,
      data: {
        args: operationDef.args,
        name: operationDef.name,
        nodeType: operationDef.nodeType,
        nodeSubtype: operationDef.nodeSubtype,
        updateNode: updateNode,
        runNode: runNode,
        nodeRunMetaData: nodeRunMetaData(),
      },
    };
    setElements((es) => es.concat(newNode));
  };

  useEffect(() => {
    console.log("elements:", elements);
  }, [elements]);

  const { transform } = useZoomPanHelper();

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      const flowDefinition = { id: props.flowKey, ...flow };
      console.log(flowDefinition);
      const resp = api.flows.create(flowDefinition);
      resp.then((data) => console.log(data)).catch((e) => console.log(e));
    }
  }, [reactFlowInstance, props.flowKey]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const resp = api.flows.read(props.flowKey);
      resp
        .then((data) => data.json())
        .then((flow) => {
          console.log(flow);
          if (flow) {
            const [x = 0, y = 0] = flow.position;
            setElements(flow.elements || []);
            transform({ x, y, zoom: flow.zoom || 0 });
          }
        });
    };

    restoreFlow();
  }, [setElements, transform, props.flowKey]);

  return (
    <div className={classes.flowdesigner}>
      <div className={classes.flowwrapper} ref={reactFlowWrapper}>
        <ReactFlow
          elements={elements}
          onConnect={onConnect}
          onEdgeUpdate={onEdgeUpdate}
          onElementsRemove={onElementsRemove}
          onLoad={onLoad}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          snapToGrid={true}
          snapGrid={[15, 15]}
        >
          <FlowControls onSave={onSave} onRestore={onRestore} />
          <Background
            variant="dots"
            gap={15}
            size={0.5}
            className={classes.designerBackground}
          />
          <MiniMap />
        </ReactFlow>
      </div>
      <Sidebar />
    </div>
  );
});

export default FlowDesigner;
