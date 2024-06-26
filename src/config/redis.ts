import { createClient, RedisClientType } from "redis";

let client: RedisClientType | null = null;

export default async function getRedisInstance() {
  if (client !== null) return client;

  client = createClient({
    url: process.env.REDIS_URL,
  });

  await client.connect();

  return client;
}
