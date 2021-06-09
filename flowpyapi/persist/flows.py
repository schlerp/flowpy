import json
from flowpyapi.persist.collections import MongoLikeCollection


persist_path = "/tmp/flowpy_flows.json"

flows = MongoLikeCollection()


async def load_json(persist_path=persist_path):
    print(f"loading flows from: {persist_path}")
    try:
        with open(persist_path, "r+") as f:
            for flow in json.load(f):
                await flows.update_one(
                    filter={"id": flow.get("id")}, update=flow, upsert=True
                )
    except:
        print(f"{persist_path} did not exist, no flows loaded!")


async def save_json(persist_path=persist_path):
    flows = await get_flows_collection()
    if len(flows._collection):
        print(f"saving {len(flows._collection)} flows to: {persist_path}")
        with open(persist_path, "w+") as f:
            print(flows._collection)
            json.dump(flows._collection, f, indent=2, skipkeys=True)


async def get_flows_collection() -> MongoLikeCollection:
    return flows
