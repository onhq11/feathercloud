import { open } from "sqlite";
import env from "@/env";
import { tables } from "@/config/table.ts";

let db: any = null;

async function initializeDb() {
  if (!db) {
    try {
      db = await open(env.db_config);
    } catch (e: any) {
      console.error(`Failed to open database: ${e.message}`);
    }
  }
}

export async function disableExpiredUsers() {
  await initializeDb();
  const now = new Date().toISOString();
  const query = `UPDATE ${tables.USERS} SET is_disabled = 1 WHERE expires_at < ? AND is_disabled = 0`;

  try {
    await db.run(query, [now]);
    console.log("Expired users have been disabled.");
  } catch (e: any) {
    console.error(`Failed to update users: ${e.message}`);
  }
}
