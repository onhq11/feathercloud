import sqlite3 from "sqlite3";
import { FileProvider, fileProvider } from "./enums/fileProvider.ts";

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
    [tables: string]: string;
  };
  default_provider: FileProvider;
}

const env: {
  db_config: DatabaseConfig;
  file_storage_config: FileStorageConfig;
  api_url: string;
  debug_mode: boolean;
  admin_emails: Array<string>;
} = {
  db_config: {
    filename: "./feathercloud.db",
    driver: sqlite3.Database,
    tables: {
      prefix: "feathercloud", // <prefix>_<tablename>
      FILES: "files",
      USERS: "users",
      OTP_USERS: "otp_users",
      EMAIL_USERS: "email_users",
      SESSIONS: "sessions",
    },
    default_provider: fileProvider.LOCAL,
  },
  file_storage_config: {
    local: {
      path: "./uploads",
    },
  },
  api_url: "http://localhost:3000",
  debug_mode: true,
  admin_emails: ["mateuszmatecki25@gmail.com"],
};

export default env;
