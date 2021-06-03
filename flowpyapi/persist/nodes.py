import importlib

from flowpyapi.persist import schemas
from flowpyapi.nodes import Node
from flowpyapi.persist.collections import MongoLikeCollection
from flowpyapi.persist.operations import get_classes_from_module
from flowpyapi.nodes import inputs, processors, outputs


nodes = MongoLikeCollection()


async def get_nodes_collection():
    return nodes


def jsonable_node_encoder(node: Node):
    return node.as_json()


def create_node(operation_schema: schemas.CreateNodeSchema):
    module_list = [inputs, processors, outputs]
    for module in module_list:
        importlib.invalidate_caches()
        module = importlib.reload(module)
        for OperationClass in get_classes_from_module(module):
            if hasattr(OperationClass, "_node_subtype") and (
                OperationClass._node_subtype == operation_schema.nodeSubtype
                and OperationClass._node_type == operation_schema.nodeType
            ):
                init_args = {x.name: x.value for x in operation_schema.args}
                print(init_args)
                print(OperationClass)
                return OperationClass(operation_schema.uniqueId, **init_args)
