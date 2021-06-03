from datetime import datetime
from typing import Any, Dict, List

import pandas as pd

import humanize


class Column(object):
    def __init__(self, name, datatype):
        self.name = name
        self.datatype = datatype

    def __repr__(self):
        return f"{self.name} ({self.datatype})"

    def as_dict(self):
        return self.__dict__


class Node(object):
    _node_type: str = "DefaultNode"
    _node_subtype: str = "NoAction"

    def __init__(self, id: str, *args, **kwargs):
        self.id = id
        self.start_ts: datetime = None
        self.end_ts: datetime = None
        self._running: bool = False
        self.df: pd.DataFrame = None
        self._prev_exception = None

    def _process(self, *args, **kwargs):
        """to be over-ridden in subclasses"""
        pass

    def process(self, *args, **kwargs):
        self._running = True
        self._prev_exception = None
        self.start_ts = datetime.now()
        try:
            self._process(*args, **kwargs)
        except Exception as e:
            self._prev_exception = e
        self._running = False
        self.end_ts = datetime.now()

    @property
    def memory_usage(self) -> str:
        if self._running:
            return "Running..."
        if self.df is not None:
            return humanize.naturalsize(self.df.memory_usage(deep=True).sum())
        return "0 kB"

    @property
    def run_time(self) -> str:
        if self._running:
            return "Running..."
        if self.df is not None:
            return humanize.naturaldelta(self.end_ts - self.start_ts)
        return "Unknown"

    @property
    def last_ran(self) -> str:
        if self._running:
            return "Running..."
        if self.df is not None:
            return humanize.naturaltime(datetime.now() - self.end_ts)
        return "Never"

    @property
    def run_error(self) -> str:
        if self._prev_exception is not None:
            return str(self._prev_exception)
        return ""

    @property
    def rows(self) -> int:
        if self._running:
            return "Running..."
        if self.df is not None:
            return len(self.df)
        return 0

    @property
    def columns(self) -> List[Dict[str, Any]]:
        if self._running:
            return "Running..."
        if self.df is not None:
            return [
                {"name": name, "dtype": str(dtype)}
                for name, dtype in self.df.dtypes.iteritems()
            ]
        return []

    @property
    def is_loaded(self):
        return bool(self.df is not None)

    def get_sample(self, *args, n_rows=100, **kwargs):
        return self.df.sample(*args, n=n_rows, **kwargs)

    def as_json(self):
        return {
            "id": self.id,
            "start_ts": self.start_ts,
            "end_ts": self.end_ts,
            "rows": self.rows,
            "columns": self.columns,
            "memory": self.memory_usage,
            "run_time": self.run_time,
            "last_ran": self.last_ran,
            "error": self.run_error,
        }

    def __repr__(self):
        return f"<{self._node_type} {self._node_subtype}>"


class InputNode(Node):
    _node_type = "InputNode"
    pass


class ProcessorNode(Node):
    _node_type = "ProcessorNode"
    pass


class OutputNode(Node):
    _node_type = "OutputNode"
    pass
