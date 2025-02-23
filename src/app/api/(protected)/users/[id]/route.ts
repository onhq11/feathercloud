import { open } from "sqlite";
import env from "@/env";
import {
  authenticateUser,
  buildResponse,
  response,
  validateFields,
} from "@/utils/apiUtils";
import { getTableConfigFillable, READ, REMOVE, UPDATE } from "@/utils/dbUtils";
import { tables } from "@/config/table.ts";
import { NextRequest } from "next/server";

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

export async function GET(req: NextRequest, context: any) {
  if (!(await authenticateUser(req, db, true)))
    return buildResponse(response["401"]);

  const { id } = context.params;
  const table = tables.USERS;

  try {
    await initializeDb();
    const item = await READ(db, table, id);
    if (!item) {
      return buildResponse(response["404"]);
    }

    return buildResponse(response["200"], item);
  } catch (e: any) {
    return buildResponse(response["500"], e.message);
  }
}

export async function PUT(req: NextRequest, context: any) {
  if (!(await authenticateUser(req, db, true)))
    return buildResponse(response["401"]);

  const { id } = context.params;
  const table = tables.USERS;
  let body: any;

  try {
    body = await req.json();
  } catch (e: any) {
    return buildResponse(response["400"], getTableConfigFillable([table]));
  }

  if (!validateFields([table], body)) {
    return buildResponse(response["400"], getTableConfigFillable([table]));
  }

  try {
    await initializeDb();
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

export async function DELETE(req: NextRequest, context: any) {
  if (!(await authenticateUser(req, db, true)))
    return buildResponse(response["401"]);

  const { id } = context.params;
  const userTable = tables.USERS;
  const emailTable = tables.EMAIL_USERS;
  const otpTable = tables.OTP_USERS;

  try {
    await initializeDb();

    const item = await READ(db, userTable, id);
    if (!item) {
      return buildResponse(response["404"]);
    }

    if (item.email_user_id) await REMOVE(db, emailTable, item.email_user_id);
    if (item.otp_user_id) await REMOVE(db, otpTable, item.otp_user_id);
    await REMOVE(db, userTable, id);

    return buildResponse(response["200"]);
  } catch (e: any) {
    return buildResponse(response["500"], e.message);
  }
}
