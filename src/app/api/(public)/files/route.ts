import { open } from "sqlite";
import env from "@/env";
import { CREATE, getTableConfigFillable, LIST, tables } from "@/utils/dbUtils";
import { buildResponse, response } from "@/utils/apiUtils";
import { previewableMimeTypes } from "@/consts/files";
import { saveFile } from "@/providers/storage/StorageProvider";

let db: any = null;

export async function GET() {
  const table = tables.FILES;

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
  let file: any;
  const table = tables.FILES;

  try {
    const formData = await req.formData();
    file = formData.get("file");

    if (!file) throw new Error("File not sent");
  } catch (e: any) {
    return buildResponse(response["400"], getTableConfigFillable(table));
  }

  if (!db) {
    db = await open(env.db_config);
  }

  try {
    const provider = env.db_config.default_provider;
    const src = await saveFile(file, provider);

    await CREATE(db, table, {
      id: null,
      name: file.name,
      size: file.size,
      src: src,
      provider: provider,
      is_preview: previewableMimeTypes.some((type) => type === file.type),
      lastModified: file.lastModified,
    });

    return buildResponse(response["201"]);
  } catch (e: any) {
    return buildResponse(response["500"], e.message);
  }
}