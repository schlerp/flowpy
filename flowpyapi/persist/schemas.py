from typing import Any, Dict, List, Optional, Union
from datetime import datetime
import pydantic
from pydantic.fields import Field


class OperationArgSchema(pydantic.BaseModel):
    name: str
    type: str
    label: str
    value: Any


class BaseOperationSchema(pydantic.BaseModel):
    nodeType: str
    nodeSubtype: str
    name: str
    args: List[OperationArgSchema]


class CreateNodeSchema(BaseOperationSchema):
    uniqueId: str


class FlowEdgeSchema(pydantic.BaseModel):
    source: str
    sourceHandle: str
    target: str
    targetHandle: str
    id: str
    type: str


class NodePositionSchema(pydantic.BaseModel):
    x: float
    y: float


class NodeSchema(pydantic.BaseModel):
    id: str
    type: str
    data: Dict
    position: NodePositionSchema


class FlowSchema(pydantic.BaseModel):
    id: str
    elements: List[Union[NodeSchema, FlowEdgeSchema]]
    position: List[float]
    zoom: float


class ColumnSchema(pydantic.BaseModel):
    name: str
    dtype: str


class NodeRunSchema(pydantic.BaseModel):
    id: str
    start_ts: Union[None, datetime]
    end_ts: Union[None, datetime]
    rows: int
    columns: List[Dict[str, Any]]
    memory: str
    run_time: str
    last_ran: str
    error: Union[None, str]


class NodeRunRequest(pydantic.BaseModel):
    uniqueId: str
    flow: FlowSchema
