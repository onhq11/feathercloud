import env from "../env.ts";

export const tables = {
  FILES: env.db_config.tables.prefix + "_" + env.db_config.tables.FILES,
  USERS: env.db_config.tables.prefix + "_" + env.db_config.tables.USERS,
  OTP_USERS: env.db_config.tables.prefix + "_" + env.db_config.tables.OTP_USERS,
  EMAIL_USERS:
    env.db_config.tables.prefix + "_" + env.db_config.tables.EMAIL_USERS,
  SESSIONS: env.db_config.tables.prefix + "_" + env.db_config.tables.SESSIONS,
};

export const tableConfig = {
  [tables.FILES]: {
    table: {
      id: "number",
      name: "string",
      size: "number",
      src: "string",
      provider: "string",
      is_preview: "boolean",
      mime_type: "string",
      last_modified: "string",
      user_id: "number",
    },
    fillable: {
      file: "File",
    },
  },
  [tables.USERS]: {
    table: {
      id: "number",
      name: "string",
      otp_user_id: "number",
      email_user_id: "number",
      is_disabled: "boolean",
      expires_at: "string",
      created_at: "string",
    },
    fillable: {
      name: "string",
      is_disabled: "boolean",
      expires_at: "string",
    },
  },
  [tables.OTP_USERS]: {
    table: {
      id: "number",
      code: "string",
    },
    fillable: {},
  },
  [tables.EMAIL_USERS]: {
    table: {
      id: "number",
      email: "string",
    },
    fillable: {
      email: "string",
    },
  },
  [tables.SESSIONS]: {
    table: {
      id: "number",
      user_id: "number",
      session_id: "number",
      created_at: "string",
    },
    fillable: {},
  },
};
