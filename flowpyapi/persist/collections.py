from typing import Any, Dict, List
import pydantic


class MongoLikeCollection(object):
    """implements a basic pymongo-like interface to a collection"""

    def __init__(self, collection: List[Any] = None):
        # parameter default [] is shared between classes hence the None shenanigans
        self._collection = collection or []

    def _try_get_object_and_id(_id: str, obj_collection: List):
        for idx, obj in enumerate(obj_collection):
            if _id == obj.get("id"):
                return idx, obj
        return False, False

    def _yield_match_idx(self, filter: Dict):
        for idx, obj in enumerate(self._collection):
            filter_matches = []
            for key, val in filter.items():
                if type(obj) != dict:
                    obj = obj.__dict__
                if obj.get(key) == val:
                    filter_matches.append(True)
                else:
                    filter_matches.append(False)
            if all(filter_matches):
                yield idx

    def find(self, filter: Dict = None, first_only: bool = False):
        if filter is None:
            return self._collection
        resp = []
        for matched_idx in self._yield_match_idx(filter):
            resp.append(self._collection[matched_idx])
            if first_only:
                break
        return resp

    async def find_one(self, filter: Dict):
        resp = self.find(filter=filter, first_only=True)
        return resp[0] if resp else None

    async def update_one(
        self,
        filter: Dict,
        update: pydantic.BaseModel,
        upsert: bool = False,
    ):
        done = False
        print("update_one", update)
        for matched_idx in self._yield_match_idx(filter):
            # we have a match so we dont need to insert later
            done = True
            # check if we should upsert
            if upsert:
                self._collection[matched_idx] = update
                break
        # if we never found a match, insert a new record
        if not done:
            self._collection.append(update)

    def delete(self, filter: Dict, first_only: bool = False):
        matched_idx = [idx for idx in self._yield_match_idx(filter)]
        if first_only:
            matched_idx = matched_idx[0:1]
        self._collection = [
            obj for idx, obj in self._collection if idx not in matched_idx
        ]
        return bool(len(matched_idx))

    async def delete_one(self, filter: Dict):
        return self.delete(filter=filter, first_only=True)
