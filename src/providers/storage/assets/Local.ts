import fs from "node:fs/promises";
import path from "node:path";
import { fileStorageConfig } from "@/config/storage";

export const localSaveFile = async (file: any) => {
  const uploadDirPath = fileStorageConfig.local.path;

  try {
    await fs.access(uploadDirPath);
  } catch {
    await fs.mkdir(uploadDirPath, { recursive: true });
  }

  try {
    const filePath = path.join(uploadDirPath, file.name);
    const fileBuffer = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(fileBuffer));

    console.log(`File saved to ${filePath}`);
    return filePath;
  } catch (e: any) {
    console.error(`Error saving file: ${e.message}`);
    throw new Error(e.message);
  }
};

export const localDeleteFile = async (filePath: string) => {
  try {
    await fs.access(filePath);
    await fs.unlink(filePath);

    console.log(`File deleted: ${filePath}`);
  } catch (e: any) {
    if (e.code === "ENOENT") {
      console.warn(`File not found: ${filePath}`);
    } else {
      console.error(`Error deleting file: ${e.message}`);
      throw new Error(e.message);
    }
  }
};
