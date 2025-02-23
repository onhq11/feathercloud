import { open } from "sqlite";
import env from "@/env";
import { authenticateUser, buildResponse, response } from "@/utils/apiUtils";
import { READ, REMOVE } from "@/utils/dbUtils";
import { deleteFile, readFile } from "@/providers/api/storage/StorageProvider";
import { tables } from "@/config/table.ts";
import { NextRequest } from "next/server";

let db: any = null;

export async function GET(_: NextRequest, context: any) {
  const { id } = context.params;
  const table = tables.FILES;

  if (!db) {
    db = await open(env.db_config);
  }

  try {
    const item = await READ(db, table, id);

    if (!item) {
      return buildResponse(response["404"]);
    }

    const file = await readFile(item.src, item.provider);
    if (file === null) {
      return buildResponse(response["404"]);
    }

    if (!Buffer.isBuffer(file)) {
      return buildResponse(response["500"], "Failed to read file");
    }

    return new Response(file, {
      status: 200,
      headers: {
        "Content-Type": item.mime_type,
        "Content-Disposition": `attachment; filename="${item.name}"`,
      },
    });
  } catch (e: any) {
    return buildResponse(response["500"], e.message);
  }
}

export async function DELETE(req: NextRequest, context: any) {
  const user = await authenticateUser(req, db);
  if (!user) return buildResponse(response["401"]);

  const { id } = context.params;
  const table = tables.FILES;

  if (!db) {
    db = await open(env.db_config);
  }

  try {
    const item = await READ(db, table, id);
    if (!item) {
      return buildResponse(response["404"]);
    }

    if (item.user_id !== user.id || env.admin_emails.includes(user.email)) {
      return buildResponse(
        response["403"],
        "You are not allowed to delete this file",
      );
    }

    await deleteFile(item.src, item.provider);
    await REMOVE(db, table, id);

    return buildResponse(response["200"]);
  } catch (e: any) {
    return buildResponse(response["500"], e.message);
  }
}
