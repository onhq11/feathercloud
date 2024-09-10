import { open } from "sqlite";
import env from "@/env";
import { ApiProps, buildResponse, response } from "@/utils/apiUtils";
import { READ, REMOVE, tables } from "@/utils/dbUtils";
import { deleteFile } from "@/providers/storage/StorageProvider";

let db: any = null;

export async function DELETE(_: Request, { params }: ApiProps) {
  const { id } = params;
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
