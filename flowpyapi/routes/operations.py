from typing import List, Union
from fastapi import APIRouter, Response, HTTPException

from flowpyapi.persist import schemas
from flowpyapi.persist.operations import get_operations_collection


tags_metadata = [
    {
        "name": "Operations",
        "description": "Endpoints for fetching info about the possible operations in FlowPy.",
    },
]


router = APIRouter()


@router.get(
    "/operation",
    tags=["Operations"],
    response_model=Union[List[schemas.BaseOperationSchema], None],
    status_code=200,
)
async def api_get_all_operations(response: Response):
    """Get all defined operation definitions matching the filters and pagination."""
    return await get_operations_collection()


@router.get(
    "/operation/{operation_id}",
    tags=["Operations"],
    response_model=schemas.BaseOperationSchema,
    status_code=200,
)
async def api_get_operation(operation_id: str):
    """Get a operation definition with the given name."""
    operations_collection = await get_operations_collection()
    for operation in operations_collection:
        if (
            f"{operation.get('nodeType')}.{operation.get('nodeSubtype')}"
            == operation_id
        ):
            return operation
    return HTTPException(
        status_code=404, detail=f"couldn't find operation: {operation_id}"
    )
