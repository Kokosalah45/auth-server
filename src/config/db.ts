import { Client } from "pg";

import config from "./config";

let db: Client | null = null;

export default async function getDB(): Promise<Client> {
  if (db !== null) return db;

  const client = new Client({
    connectionString: config.db.url,
  });

  await client.connect();

  db = client;

  return db;
}
