import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";

import { Client } from "pg";

import config from "./config";

let db: NodePgDatabase<Record<string, never>> | null = null;

export default async function getDB(): Promise<
  NodePgDatabase<Record<string, never>>
> {
  const client = new Client({
    user: config.db.user,
    host: config.db.host,
    database: config.db.database,
    password: config.db.password,
    port: +(config.db.port || 5432),
  });
  await client.connect();

  if (db !== null) return db;

  db = drizzle(client);

  return db;
}
