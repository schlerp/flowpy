from typing import Dict, List, Tuple
import networkx as nx
from flowpyapi.persist import schemas
from flowpyapi.persist.nodes import get_nodes_collection
from flowpyapi.processing.edge import Edge
from flowpyapi.nodes import InputNode, Node


class Flow(object):
    def __init__(self, edge_list: List[Edge]):
        self.edge_list = edge_list

    def _init_inputs(self):
        for edge in self.edge_list:
            source_node = edge.node_source
            if isinstance(source_node, InputNode):
                source_node._process()

    def _process(self, start_node: Node):
        # initialise all input nodes
        self._init_inputs()

        previous_node = start_node
        for edge in self.edge_list:
            target_node = edge.node_target
            if edge.node_source == previous_node:
                target_node._process(previous_node)
                previous_node = target_node

    def run_node(self, re_run: bool = False):
        pass


async def build_flow(flow_def: schemas.FlowSchema):
    nodes_collection = await get_nodes_collection()
    edge_list = []
    for element in flow_def.elements:
        if type(element) == schemas.FlowEdgeSchema:
            source_node = await nodes_collection.find_one(filter={"id": element.source})
            target_node = await nodes_collection.find_one(filter={"id": element.target})
            new_edge = Edge(source_node, target_node)
            edge_list.append(new_edge)
    return Flow(edge_list)


def get_node_dependancies(
    graph: nx.DiGraph, start_nodes: List[str]
) -> List[Tuple[str, int]]:
    nodes = [(x, 0) for x in start_nodes]
    for node, depth in nodes:
        print(f"dependancies for {node}")
        this_depth = depth - 1
        for prenode in graph.predecessors(node):
            nodes.append((prenode, this_depth))
            print(f"{node} depends on {prenode} at depth {this_depth}")
            print(nodes)
        print("")
    return nodes


def clean_dependancies(dependancies: List[Tuple[str, int]]) -> List[Dict[str, int]]:
    # make the dependancies unique to node/level
    dependancies = set(dependancies)

    # create some varaibles to keep track
    dep_depth_map = {}
    max_depth = 0

    # build a dict where each key is a node and each value is a list of depths
    # {node: [depth1, depth2...]}
    # also get the max depth so we can use it to convert to positive exec order
    for node, depth in dependancies:
        dep_depth_map.setdefault(node, []).append(depth)
        max_depth = min(depth, max_depth)

    # sort the depth map.. not strictly necesarry but nice for reading output when printed
    dep_depth_map = sorted(dep_depth_map.items(), key=lambda x: min(x[1]))

    return [
        {"node": node, "exec_order": min(depth) + abs(max_depth)}
        for node, depth in dep_depth_map
    ]


async def run_node(node_id: str, flow_def: schemas.FlowSchema, rerun: bool = False):
    edge_list = [
        [element.source, element.target]
        for element in flow_def.elements
        if type(element) == schemas.FlowEdgeSchema
    ]

    node_list = [
        element.id
        for element in flow_def.elements
        if type(element) == schemas.NodeSchema
    ]

    print(edge_list)
    print(node_list)

    nxflow = nx.DiGraph(edge_list)
    nxflow.add_nodes_from(node_list)

    exec_order = clean_dependancies(get_node_dependancies(nxflow, [node_id]))

    nodes_collection = await get_nodes_collection()

    for exec_stage in exec_order:
        print(exec_stage)
        node_id = exec_stage["node"]
        node: Node = await nodes_collection.find_one(filter={"id": node_id})

        if node is not None and (rerun or node.df is None):
            print(f"running node id={node_id}")
            if node._node_type == "InputNode":
                node.process()
                continue

            previous_nodes = [
                await nodes_collection.find_one(filter={"id": x})
                for x in nxflow.predecessors(node_id)
            ]
            node.process(input_nodes=previous_nodes)
