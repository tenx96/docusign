import redis
from datetime import datetime
from fastapi.logger import logger
r = redis.Redis(host="localhost", port=6379, db=0)

class RedisCache:
    def __init__(self):
        self.r = r

    def set(self, key, value):
        self.r.set(key, value)

    def get(self, key):
        return self.r.get(key)

    def delete(self, key):
        self.r.delete(key)

    def save_access_token(self, token):
        self.r.set("expiry", datetime.now().timestamp() + 3600)
        self.r.set("access_token", token)

    def get_access_token(self):
        expiry = self.r.get("expiry")
        if not expiry:
            return None

        if float(expiry.decode("utf-8")) < datetime.now().timestamp():
            return None

        access_token = self.r.get("access_token")

        if not access_token:
            return None
        
        logger.debug("USING CACHED TOKEN")

        return access_token.decode("utf-8")
