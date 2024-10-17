import os
import pickle
from datetime import datetime, timedelta

CACHE_FILE = "ipca_cache.pkl"
CACHE_EXPIRATION_DAYS = 30  # Atualiza o cache a cada 30 dias


def is_cache_valid():
    if not os.path.exists(CACHE_FILE):
        return False
    cache_time = os.path.getmtime(CACHE_FILE)
    return (datetime.now() - datetime.fromtimestamp(cache_time)) < timedelta(
        days=CACHE_EXPIRATION_DAYS
    )


def load_cache():
    if is_cache_valid():
        with open(CACHE_FILE, "rb") as f:
            return pickle.load(f)
    return None


def save_cache(data):
    with open(CACHE_FILE, "wb") as f:
        pickle.dump(data, f)
