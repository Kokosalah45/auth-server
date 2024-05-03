import { Client } from "pg";

import config from "./config";

let db: Client | null = null;

export default async function getDB(): Promise<Client> {
  if (db !== null) return db;

  const client = new Client({
    user: config.db.user,
    host: config.db.host,
    database: config.db.database,
    password: config.db.password,
    port: +(config.db.port || 5432),
  });

  await client.connect();

  db = client;

  return db;
}
