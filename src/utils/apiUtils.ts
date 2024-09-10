import { getTableConfigFillable } from "@/utils/dbUtils";
import env from "@/env";
import { tables } from "@/config/table.ts";
import { decodeFromBase64 } from "next/dist/build/webpack/loaders/utils";
import { open } from "sqlite";

export const buildResponse = (
  response: Response,
  data?: any,
  headers?: any,
) => {
  const result: any = { ...response };
  if (data && (!response.protect || env.debug_mode)) {
    result.data = data;
  }

  delete result.protect;

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json", ...headers },
    status: response.status,
  });
};

export interface Response {
  message: string;
  status: number;
  protect?: boolean;
}

export const response: Record<number, Response> = {
  500: {
    message: "Internal server error",
    status: 500,
    protect: true,
  },
  404: {
    message: "Content not found",
    status: 404,
  },
  403: {
    message: "Forbidden",
    status: 403,
  },
  401: {
    message: "Unauthorized",
    status: 401,
  },
  400: {
    message: "Bad request",
    status: 400,
  },
  201: {
    message: "Successfully created",
    status: 201,
  },
  200: {
    message: "OK",
    status: 200,
  },
};

export const validateFields = (tables: Array<string>, data: any) => {
  const tableConfig = getTableConfigFillable(tables);

  for (const field of tableConfig) {
    const { name, type } = field;

    if (type.split(" | ").some((type: string) => type === "null")) {
      continue;
    }

    if (data[name] == null) {
      return false;
    }

    if (typeof data[name] !== type) {
      return false;
    }
  }

  return true;
};

export const generateImageUrl = (id: string) => {
  return `${env.api_url}/api/files/${id}`;
};

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateSessionId = () => {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};

export const authenticateUser = async (
  req: Request,
  db: any,
  admin: boolean = false,
) => {
  let authDb: any = null;

  const sessionId = req.headers.get("Cookie")?.split("session_id=")[1];
  if (!sessionId) {
    return false;
  }

  if (!db) {
    try {
      authDb = await open(env.db_config);
    } catch (e: any) {
      throw new Error(`Failed to open database: ${e.message}`);
    }
  } else {
    authDb = db;
  }

  try {
    const user = await authDb.get(
      `SELECT * FROM ${tables.SESSIONS} INNER JOIN ${tables.USERS} ON ${tables.SESSIONS}.user_id = ${tables.USERS}.id LEFT JOIN ${tables.EMAIL_USERS} ON ${tables.USERS}.email_user_id = ${tables.EMAIL_USERS}.id WHERE session_id=?`,
      [decodeFromBase64(decodeURIComponent(sessionId))],
    );

    if (admin) {
      return env.admin_emails.includes(user.email);
    }

    return { session_id: sessionId, ...user };
  } catch (e: any) {
    return false;
  }
};
