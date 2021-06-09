from typing import List
import pandas as pd
from flowpyapi.nodes import Node, ProcessorNode


class ProcessorQueryNode(ProcessorNode):
    _node_subtype = "query"
    _node_name = "Query Filter"

    def __init__(self, id: str, query_string: str):
        super().__init__(id)
        self.query_string = query_string

    def _process(self, input_nodes: List[Node]):
        # TODO: fix multiple input nodes instead of defaulting to first
        input_node = input_nodes[0]
        self.df = input_node.df.query(self.query_string)


class ProcessorSetIndexNode(ProcessorNode):
    _node_subtype = "set_index"
    _node_name = "Set Index"

    def __init__(self, id: str, index_cols: List[str]):
        super().__init__(id)
        self.index_cols = index_cols

    def _process(self, input_nodes: List[Node]):
        # TODO: fix multiple input nodes instead of defaulting to first
        input_node = input_nodes[0]
        self.df = input_node.df.set_index(self.index_cols)


# class ProcessorSelectColumnsNode(ProcessorNode):
#     _node_subtype = "select"
#     _node_name = "Select Columns"

#     def __init__(self, id: str, columns: List[str]):
#         super().__init__(id)
#         self.columns = columns

#     def _process(self, input_node: Node):
#         self.df = input_node.df[self.columns]
