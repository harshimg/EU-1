from datetime import datetime, timezone

def utcnow():
    """
    Returns naive UTC datetime safe for MongoDB.
    Linter-safe and comparison-safe.
    """
    return datetime.now(timezone.utc).replace(tzinfo=None)
