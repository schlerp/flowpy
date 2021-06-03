import fastapi
from fastapi.middleware.cors import CORSMiddleware

from flowpyapi.routes import flows, operations, nodes


app = fastapi.FastAPI(
    title="FlowPy API",
    description="The backend API for the FlowPy data processing environment.",
    version="0.0.1",
)


# # set up application database
# app.add_event_handler("startup", connect_db)
# app.add_event_handler("shutdown", close_db)


# add router endpoints
app.include_router(operations.router)
app.include_router(flows.router)
app.include_router(nodes.router)


# set up middleware for CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8321)
