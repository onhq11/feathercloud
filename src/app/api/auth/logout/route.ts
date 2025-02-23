import { authenticateUser, buildResponse, response } from "@/utils/apiUtils.ts";
import { open } from "sqlite";
import env from "@/env.ts";
import { tables } from "@/config/table.ts";

let db: any = null;

async function initializeDb() {
  if (!db) {
    try {
      db = await open(env.db_config);
    } catch (e: any) {
      throw new Error(`Failed to open database: ${e.message}`);
    }
  }
}

export async function POST(req: Request) {
  let body: any;

  const user = await authenticateUser(req, db);

  try {
    body = await req.json();
  } catch (e: any) {
    return buildResponse(response["400"]);
  }

  if (!user) {
    return buildResponse(response["200"]);
  }

  try {
    await initializeDb();

    if (body.all_devices) {
      await db.run(`DELETE FROM ${tables.SESSIONS} WHERE user_id = ?`, user.id);
      return buildResponse(response["200"]);
    }

    await db.run(
      `DELETE FROM ${tables.SESSIONS} WHERE user_id = ? AND session_id = ?`,
      user.id,
      user.session_id,
    );

    return buildResponse(response["200"]);
  } catch (e: any) {
    return buildResponse(response["500"], e.message);
  }
}
