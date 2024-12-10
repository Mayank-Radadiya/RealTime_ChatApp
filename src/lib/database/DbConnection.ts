// https://console.upstash.com/redis/b91ee322-1aac-426f-a5f8-1fb074e9ddd0?teamid=0

import { Redis } from "@upstash/redis";

export const dbConnection = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});