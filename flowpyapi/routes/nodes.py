from flowpyapi.processing.flow import run_node
from typing import List, Union
from fastapi import APIRouter
from fastapi import Response
from fastapi.responses import JSONResponse
from fastapi import HTTPException

from flowpyapi.persist import schemas
from flowpyapi.persist.nodes import get_nodes_collection, create_node


tags_metadata = [
    {
        "name": "Nodes",
        "description": "Endpoints for perofrming CRUD operations on Nodes",
    },
]


router = APIRouter()


@router.get(
    "/node",
    tags=["Nodes"],
    response_model=Union[List[schemas.NodeRunSchema], None],
    status_code=200,
)
async def api_get_all_nodes(response: Response):
    """Get all defined node definitions matching the filters and pagination."""
    nodes_collection = await get_nodes_collection()
    print([x.as_json() for x in nodes_collection.find()])
    return [x.as_json() for x in nodes_collection.find()]


@router.post(
    "/node",
    tags=["Nodes"],
    response_model=schemas.NodeRunSchema,
    status_code=201,
)
async def api_create_node(operation: schemas.CreateNodeSchema):
    """Create a new node definition"""
    nodes_collection = await get_nodes_collection()
    node = create_node(operation)
    if node:
        await nodes_collection.update_one(
            filter={"id": operation.uniqueId},
            update=node,
            upsert=True,
        )
        return JSONResponse(node.as_json())
    return HTTPException(400, "Creation of operation node failed!")


@router.get(
    "/node/{node_id}",
    tags=["Nodes"],
    response_model=schemas.NodeRunSchema,
    status_code=200,
)
async def api_get_node(node_id: str):
    """Get a node definition with the given name."""
    nodes_collection = await get_nodes_collection()
    node = await nodes_collection.find_one(filter={"id": node_id})
    if node is not None:
        return JSONResponse(node.as_json())
    return HTTPException(403, f"Node with id {node_id} not found")


@router.post(
    "/node/run",
    tags=["Nodes"],
    response_model=bool,
    status_code=200,
)
async def api_run_node(run_request: schemas.NodeRunRequest):
    """Get a node definition with the given name."""
    nodes_collection = await get_nodes_collection()
    node = await nodes_collection.find_one(filter={"id": run_request.uniqueId})

    if node is None:
        return HTTPException(
            403, f"No matching node was found for id={run_request.uniqueId}"
        )
    if not node._running:
        await run_node(run_request.uniqueId, run_request.flow)
        return True
    return HTTPException(
        400, f"Node id={run_request.uniqueId} is currently running, please wait..."
    )


# @router.put(
#     "/node/{node_id}",
#     tags=["Nodes"],
#     response_model=schemas.NodeSchema,
#     status_code=200,
# )
# async def api_update_node(node_id: str, node: schemas.NodeSchema):
#     """Update a node definition with the given name."""
#     if node.id != node_id:
#         return Response("node object id and url do not match!", status_code=400)

#     nodes_collection = await get_nodes_collection()
#     await nodes_collection.update_one(
#         filter={"id": node_id},
#         update=node,
#         upsert=True,
#     )
#     return await nodes_collection.find_one(filter={"id": node_id})


@router.delete(
    "/node/{node_id}",
    tags=["Nodes"],
    response_model=bool,
    status_code=200,
)
async def api_delete_node(node_id: str):
    """Delete a node definition with the given name."""
    nodes_collection = await get_nodes_collection()
    result = await nodes_collection.delete_one(filter={"id": node_id})
    if result.deleted_count:
        return Response(f"node config {node_id} deleted!")
    return Response(f"no node config {node_id} to delete!", status_code=400)
