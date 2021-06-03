from flowpyapi.nodes import Node, OutputNode
import pandas as pd


class OutputCSVNode(OutputNode):
    _node_subtype = "csv"
    _node_name = "CSV Output"

    def __init__(self, id: str, output_path: str, index: bool = False):
        super().__init__(id)
        self.output_path = output_path
        self.index = index

    def _process(self, input_nodes: Node):
        # TODO: fix multiple input nodes instead of defaulting to first
        input_node = input_nodes[0]
        self.df = input_node.df
        self.df.to_csv(self.output_path, index=self.index)
