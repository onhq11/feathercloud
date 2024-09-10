import sqlite3 from "sqlite3";
import { FileProvider, fileProvider } from "@/consts/files";

export interface FileStorageConfig {
  local: {
    path: string;
  };
}

export interface DatabaseConfig {
  filename: string;
  driver: any;
  tables: {
    prefix: string;
    FILES: string;
    USERS: string;
    PERMISSIONS: string;
    USER_PERMISSIONS: string;
  };
  default_provider: FileProvider;
}

const env: {
  db_config: DatabaseConfig;
  file_storage_config: FileStorageConfig;
} = {
  db_config: {
    filename: "./feathercloud.db",
    driver: sqlite3.Database,
    tables: {
      prefix: "feathercloud", // <prefix>_<tablename>
      FILES: "files",
      USERS: "users",
      PERMISSIONS: "permissions",
      USER_PERMISSIONS: "user_permissions",
    },
    default_provider: fileProvider.LOCAL,
  },
  file_storage_config: {
    local: {
      path: "./uploads",
    },
  },
};

export default env;
