from flowpyapi.persist.collections import MongoLikeCollection


flows = MongoLikeCollection()


async def get_flows_collection() -> MongoLikeCollection:
    return flows
