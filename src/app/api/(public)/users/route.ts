import { open } from "sqlite";
import env from "@/env";
import { CREATE, getTableConfigFillable, LIST, tables } from "@/utils/dbUtils";
import { buildResponse, response, validateFields } from "@/utils/apiUtils";

let db: any = null;

export async function GET() {
  const table = tables.USERS;

  if (!db) {
    db = await open(env.db_config);
  }

  try {
    const items = await LIST(db, table);

    if (!Array.isArray(items)) {
      return buildResponse(response["404"]);
    }

    return buildResponse(response["200"], items);
  } catch (e: any) {
    return buildResponse(response["500"], e.message);
  }
}

export async function POST(req: Request) {
  let body: any;
  const table = tables.USERS;

  try {
    body = await req.json();
  } catch (e: any) {
    return buildResponse(response["400"], getTableConfigFillable(table));
  }

  if (!validateFields(table, body)) {
    return buildResponse(response["400"], getTableConfigFillable(table));
  }

  if (!db) {
    db = await open(env.db_config);
  }

  try {
    await CREATE(db, table, {
      id: null,
      name: body.name,
      email: body.email,
      key: body.key,
    });

    return buildResponse(response["201"]);
  } catch (e: any) {
    return buildResponse(response["500"], e.message);
  }
}
