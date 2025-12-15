from bson import ObjectId
from datetime import datetime
from typing import Any

def mongo_to_json(obj: Any):
    """
    Recursively converts MongoDB documents to JSON-serializable objects
    """
    if isinstance(obj, list):
        return [mongo_to_json(item) for item in obj]

    if isinstance(obj, dict):
        return {
            ("_id" if key == "_id" else key): mongo_to_json(value)
            for key, value in obj.items()
        }

    if isinstance(obj, ObjectId):
        return str(obj)

    if isinstance(obj, datetime):
        return obj.isoformat()

    return obj


from bson import ObjectId

def serialize_mongo(data):
    if isinstance(data, list):
        return [serialize_mongo(d) for d in data]
    if isinstance(data, dict):
        return {
            k: serialize_mongo(v)
            for k, v in data.items()
        }
    if isinstance(data, ObjectId):
        return str(data)
    return data
