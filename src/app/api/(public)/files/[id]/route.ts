import { open } from "sqlite";
import env from "@/env";
import { buildResponse, response } from "@/utils/apiUtils";
import { READ, REMOVE } from "@/utils/dbUtils";
import { deleteFile } from "@/providers/api/storage/StorageProvider";
import { tables } from "@/config/table";
import { NextRequest } from "next/server";

let db: any = null;

export async function DELETE(_: NextRequest, context: any) {
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

    await deleteFile(item.src, item.provider);
    await REMOVE(db, table, id);

    return buildResponse(response["200"]);
  } catch (e: any) {
    return buildResponse(response["500"], e.message);
  }
}
