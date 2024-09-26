import { open } from "sqlite";
import env from "@/env";
import { ApiProps, buildResponse, response } from "@/utils/apiUtils";
import {
  getTableConfigFillable,
  READ,
  REMOVE,
  tables,
  UPDATE,
} from "@/utils/dbUtils";

let db: any = null;

export async function GET(_: Request, { params }: ApiProps) {
  const { id } = params;
  const table = tables.USERS;

  if (!db) {
    db = await open(env.db_config);
  }

  try {
    const item = await READ(db, table, id);
    if (!item) {
      return buildResponse(response["404"]);
    }

    return buildResponse(response["200"], item);
  } catch (e: any) {
    return buildResponse(response["500"], e.message);
  }
}

export async function PUT(req: Request, { params }: ApiProps) {
  const { id } = params;
  const table = tables.USERS;
  let body: any;

  try {
    body = await req.json();
  } catch (e: any) {
    return buildResponse(response["400"], getTableConfigFillable(table));
  }

  if (!db) {
    db = await open(env.db_config);
  }

  try {
    const item = await READ(db, table, id);
    if (!item) {
      return buildResponse(response["404"]);
    }

    await UPDATE(db, table, id, body);

    return buildResponse(response["200"]);
  } catch (e: any) {
    return buildResponse(response["500"], e.message);
  }
}

export async function DELETE(_: Request, { params }: ApiProps) {
  const { id } = params;
  const table = tables.USERS;

  if (!db) {
    db = await open(env.db_config);
  }

  try {
    const item = await READ(db, table, id);
    if (!item) {
      return buildResponse(response["404"]);
    }

    await REMOVE(db, table, id);

    return buildResponse(response["200"]);
  } catch (e: any) {
    return buildResponse(response["500"], e.message);
  }
}
