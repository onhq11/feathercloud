import { open } from "sqlite";
import env from "@/env";
import { CREATE, getTableConfigFillable, LIST } from "@/utils/dbUtils";
import {
  authenticateUser,
  buildResponse,
  generateImageUrl,
  response,
} from "@/utils/apiUtils";
import { previewableMimeTypes } from "@/consts/files";
import { saveFile } from "@/providers/api/storage/StorageProvider";
import { tables } from "@/config/table.ts";
import { NextRequest } from "next/server";

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

    const transformer = items.map((row) => ({
      id: row.id,
      name: row.name,
      size: row.size,
      image: generateImageUrl(row.id),
      is_preview: row.is_preview,
      last_modified: row.last_modified,
    }));

    return buildResponse(response["200"], transformer);
  } catch (e: any) {
    return buildResponse(response["500"], e.message);
  }
}

export async function POST(req: NextRequest) {
  const user = await authenticateUser(req, db);
  if (!user) return buildResponse(response["401"]);

  let file: any;
  const table = tables.FILES;

  try {
    const formData = await req.formData();
    file = formData.get("file");

    if (!file) return buildResponse(response["400"], "No file sent");
  } catch (e: any) {
    return buildResponse(response["400"], getTableConfigFillable([table]));
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
      mime_type: file.type,
      lastModified: file.lastModified,
      user_id: user.id,
    });

    return buildResponse(response["201"]);
  } catch (e: any) {
    return buildResponse(response["500"], e.message);
  }
}
