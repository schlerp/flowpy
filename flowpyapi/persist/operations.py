from typing import Dict, Iterator, List, Any
from types import ModuleType
import inspect
import importlib

from flowpyapi.nodes import inputs, processors, outputs


TYPE_MAP = {
    str: "text",
    float: "float",
    int: "int",
    bool: "bool",
    inspect._empty: "text",
    List[str]: "array",
    List[int]: "array",
    List[float]: "array",
    List[bool]: "array",
    List[Any]: "array",
}

EMPTY_MAP = {"text": "", "float": 0.0, "int": 0, "bool": False, "array": []}


def get_classes_from_module(module: ModuleType) -> Iterator[Any]:
    for _, obj in inspect.getmembers(module):
        if inspect.isclass(obj):
            yield obj


def get_init_args_from_class(_class: Any) -> Iterator[Dict[str, str]]:
    class_init_sig = inspect.signature(_class.__init__)
    for name, param in class_init_sig.parameters.items():
        if name != "self":
            _type = TYPE_MAP.get(param.annotation, "text")
            default_val = param.default if param.default != inspect._empty else None
            if not default_val:
                default_val = EMPTY_MAP[_type]
            yield {
                "name": name,
                "type": _type,
                "value": default_val,
                "label": name.replace("_", " ").title(),
            }


async def get_operations_collection(
    module_list: List[ModuleType] = [inputs, processors, outputs]
) -> List[Dict[str, Any]]:
    operations_collection = []
    for module in module_list:
        importlib.invalidate_caches()
        module = importlib.reload(module)
        for _class in get_classes_from_module(module):
            if hasattr(_class, "_node_name"):
                args = [arg for arg in get_init_args_from_class(_class)]
                operations_collection.append(
                    {
                        "nodeType": _class._node_type,
                        "nodeSubtype": _class._node_subtype,
                        "name": _class._node_name,
                        "args": args,
                    }
                )
    return operations_collection
