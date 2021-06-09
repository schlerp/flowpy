from typing import Literal, Union
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


class InputParquetNode(InputNode):
    _node_subtype = "parquet"
    _node_name = "Parquet Input"

    def __init__(
        self,
        id: str,
        input_path: str,
    ):
        super().__init__(id)
        self.input_path = input_path

    def _process(self):
        self.df = pd.read_parquet(self.input_path)


class InputExcelNode(InputNode):
    _node_subtype = "excel"
    _node_name = "Excel Input"

    def __init__(
        self,
        id: str,
        input_path: str,
        sheet_name: Union[str, int] = 0,
    ):
        super().__init__(id)
        self.input_path = input_path
        self.sheet_name = sheet_name

    def _process(self):
        self.df = pd.read_excel(filepath=self.input_path, sheet_name=self.sheet_name)


class InputJSONNode(InputNode):
    _node_subtype = "json"
    _node_name = "JSON Input"

    def __init__(
        self,
        id: str,
        input_path: str,
        orient: Literal["split", "records", "index", "columns", "values"] = "columns",
        typ: Literal["frame", "series"] = "frame",
    ):
        super().__init__(id)
        self.input_path = input_path
        self.typ = typ
        self.orient = "index" if typ == "series" else "columns"

    def _process(self):
        self.df = pd.read_json(self.input_path, typ=self.typ, orient=self.orient)
