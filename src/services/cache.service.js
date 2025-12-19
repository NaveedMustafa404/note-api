import { initRedis } from "../config/redis.js";

const get = async (key) => {
  const redis = await initRedis();
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

const set = async (key, value, ttl = 60) => {
  const redis = await initRedis();
  await redis.setEx(key, ttl, JSON.stringify(value));
};

const del = async (key) => {
  const redis = await initRedis();
  await redis.del(key);
};

export default { get, set, del };