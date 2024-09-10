export const tables = {
  FILES: "FILES",
  USERS: "USERS",
  PERMISSIONS: "PERMISSIONS",
  USER_PERMISSIONS: "USER_PERMISSIONS",
}

export const tableConfig = {
  [tables.FILES]: {
    table: {
      id: "number",
      name: "string",
      size: "number",
      src: "string",
      provider: "string",
      is_preview: "boolean",
      last_modified: "string",
    },
    fillable: {
      file: "File",
    },
  },
  [tables.USERS]: {
    table: {
      id: "number",
      name: "string",
      email: "string",
      key: "string",
      permissions: "object",
    },
    fillable: {
      name: "string",
      email: "string",
      key: "string",
    },
  },
  [tables.PERMISSIONS]: {
    table: {
      id: "number",
      name: "string",
    },
    fillable: {},
  },
  [tables.USER_PERMISSIONS]: {
    table: {
      user_id: "number",
      permission_id: "number",
    },
    fillable: {
      user_id: "number",
      permission_id: "number",
    },
  },
};