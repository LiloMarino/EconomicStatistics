import os
from datetime import datetime, timedelta

import pandas as pd

CACHE_FILE = "ipca_cache.csv"
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
        return pd.read_csv(CACHE_FILE)
    return None


def save_cache(data):
    data.to_csv(CACHE_FILE, index=False)
