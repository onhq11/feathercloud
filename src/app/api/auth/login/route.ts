import {
  buildResponse,
  generateSessionId,
  response,
} from "@/utils/apiUtils.ts";
import { userType } from "@/enums/userType.ts";
import { open } from "sqlite";
import env from "@/env.ts";
import { CREATE } from "@/utils/dbUtils.ts";
import { tables } from "@/config/table.ts";
import { encodeToBase64 } from "next/dist/build/webpack/loaders/utils";
import { serialize } from "cookie";

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

  try {
    body = await req.json();
  } catch (e: any) {
    return buildResponse(response["400"]);
  }

  switch (body.type) {
    case userType.OTP:
      try {
        await initializeDb();
        const user = await db.get(
          `SELECT * FROM ${tables.USERS} INNER JOIN ${tables.OTP_USERS} ON ${tables.USERS}.otp_user_id = ${tables.OTP_USERS}.id WHERE ${tables.OTP_USERS}.code=?`,
          [body.code],
        );

        if (!user) {
          return buildResponse(response["404"]);
        }

        if (user.is_disabled || new Date(user.expires_at) < new Date()) {
          return buildResponse(response["403"]);
        }

        const sessionId = generateSessionId();
        await CREATE(db, tables.SESSIONS, {
          id: null,
          user_id: user.id,
          session_id: sessionId,
          created_at: new Date().toISOString(),
        });

        const sessionCookie = serialize(
          "session_id",
          encodeToBase64(sessionId),
          {
            httpOnly: true,
            secure: true,
            path: "/",
          },
        );

        return buildResponse(response["200"], null, {
          "Set-Cookie": sessionCookie,
        });
      } catch (e: any) {
        return buildResponse(response["500"], e.message);
      }

    case userType.EMAIL:
      try {
        await initializeDb();
        const user = await db.get(
          `SELECT * FROM ${tables.USERS} INNER JOIN ${tables.EMAIL_USERS} ON ${tables.USERS}.email_user_id = ${tables.EMAIL_USERS}.id WHERE ${tables.EMAIL_USERS}.email=?`,
          [body.email],
        );

        if (!user) {
          return buildResponse(response["404"]);
        }

        if (
          user.is_disabled ||
          (user.expires_at !== null && new Date(user.expires_at) < new Date())
        ) {
          return buildResponse(response["403"]);
        }

        const sessionId = generateSessionId();
        await CREATE(db, tables.SESSIONS, {
          id: null,
          user_id: user.id,
          session_id: sessionId,
          created_at: new Date().toISOString(),
        });

        const sessionCookie = serialize(
          "session_id",
          encodeToBase64(sessionId),
          {
            httpOnly: true,
            secure: true,
            path: "/",
          },
        );

        return buildResponse(response["200"], null, {
          "Set-Cookie": sessionCookie,
        });
      } catch (e: any) {
        return buildResponse(response["500"], e.message);
      }

    default:
      return buildResponse(response["400"], "Invalid user type");
  }
}
