import os
import shutil
from uuid import uuid4
import time
from threading import Thread

BASE_TEMP_DIR = "/tmp/alpharesult"
TTL_SECONDS = 60 * 60  # 60 minutes


def create_temp_dir(admin_id: str):
    req_id = str(uuid4())
    path = os.path.join(BASE_TEMP_DIR, f"{admin_id}",req_id)
    os.makedirs(path, exist_ok=True)

    # start auto-delete thread
    Thread(target=_delete_later, args=(path,), daemon=True).start()

    return path

def _delete_later(path: str):
    time.sleep(TTL_SECONDS)
    cleanup_temp_dir(path)


def cleanup_temp_dir(path: str):
    try:
        if os.path.exists(path):
            shutil.rmtree(path)
    except Exception:
        pass

