from flowpyapi.nodes import InputNode
import pandas as pd


class InputCSVNode(InputNode):
    _node_subtype = "csv"
    _node_name = "CSV Input"

    def __init__(
        self,
        id: str,
        input_path: str,
    ):
        super().__init__(id)
        self.input_path = input_path

    def _process(self):
        self.df = pd.read_csv(self.input_path)
