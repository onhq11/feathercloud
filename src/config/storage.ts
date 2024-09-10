import path from "node:path";
import env from "@/env";

const uploadDirEnvPath = env.file_storage_config.local.path || "./uploads";

const resolvedUploadDir = path.isAbsolute(uploadDirEnvPath)
  ? uploadDirEnvPath
  : path.resolve(uploadDirEnvPath);

if (!resolvedUploadDir) {
  throw new Error("Invalid upload directory path.");
}

export const fileStorageConfig = {
  local: {
    path: resolvedUploadDir,
  },
};
