import { createClient } from "redis";

let redisClient;

export const initRedis = async () => {
  if (!redisClient) {
    redisClient = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
    });

    redisClient.on("error", (error) => {
      console.error("Redis error", error);
    });

    await redisClient.connect();
  }

  return redisClient;
};
