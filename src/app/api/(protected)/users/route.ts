import { open } from "sqlite";
import env from "@/env";
import { CREATE, getTableConfigFillable } from "@/utils/dbUtils";
import {
  authenticateUser,
  buildResponse,
  generateOtp,
  response,
  validateFields,
} from "@/utils/apiUtils";
import { tables } from "@/config/table.ts";
import { matchUserTypeTable, userType } from "@/enums/userType";
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

export async function GET(req: NextRequest) {
  if (!(await authenticateUser(req, db, true)))
    return buildResponse(response["401"]);

  const table = tables.USERS;

  try {
    await initializeDb();
    const items = await db.all(
      `SELECT * FROM ${table} LEFT JOIN ${tables.OTP_USERS} ON ${table}.otp_user_id = ${tables.OTP_USERS}.id LEFT JOIN ${tables.EMAIL_USERS} ON ${table}.email_user_id = ${tables.EMAIL_USERS}.id`,
    );

    if (!Array.isArray(items)) {
      return buildResponse(response["404"]);
    }

    return buildResponse(response["200"], items);
  } catch (e: any) {
    return buildResponse(response["500"], e.message);
  }
}

export async function POST(req: NextRequest) {
  if (!(await authenticateUser(req, db, true)))
    return buildResponse(response["401"]);

  let body: any;
  const userTable = tables.USERS;
  const emailTable = tables.EMAIL_USERS;
  const otpTable = tables.OTP_USERS;

  try {
    body = await req.json();
  } catch (e: any) {
    return buildResponse(response["400"]);
  }

  const validateTables = [userTable];
  validateTables.push(matchUserTypeTable[body.type]);

  if (!validateFields(validateTables, body)) {
    return buildResponse(
      response["400"],
      getTableConfigFillable(validateTables),
    );
  }

  switch (body.type) {
    case userType.OTP:
      try {
        await initializeDb();
        const otpUser = await CREATE(db, otpTable, {
          id: null,
          code: generateOtp(),
        });

        await CREATE(db, userTable, {
          id: null,
          name: body.name,
          otp_user_id: otpUser.lastID,
          email_user_id: null,
          is_disabled: Boolean(body.is_disabled),
          expires_at: new Date(body.expires_at).toISOString(),
          created_at: new Date().toISOString(),
        });

        const createdUser = await db.get(
          `SELECT * FROM ${userTable} INNER JOIN ${otpTable} ON ${userTable}.otp_user_id = ${otpTable}.id WHERE ${userTable}.id=?`,
          [otpUser.lastID],
        );
        return buildResponse(response["201"], {
          code: createdUser.code,
          expires_at: createdUser.expires_at,
        });
      } catch (e: any) {
        return buildResponse(response["500"], e.message);
      }

    case userType.EMAIL:
      try {
        await initializeDb();
        const emailUser = await CREATE(db, emailTable, {
          id: null,
          email: body.email,
        });

        await CREATE(db, userTable, {
          id: null,
          name: body.name,
          otp_user_id: null,
          email_user_id: emailUser.lastID,
          is_disabled: Boolean(body.is_disabled),
          expires_at: new Date(body.expires_at).toISOString(),
          created_at: new Date().toISOString(),
        });

        return buildResponse(response["201"]);
      } catch (e: any) {
        return buildResponse(response["500"], e.message);
      }

    default:
      return buildResponse(response["400"], "Invalid user type");
  }
}
