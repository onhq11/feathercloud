import env from "@/env";

export const LIST = async (db: any, table: Tables) => {
  return await db.all(`SELECT *
                       FROM ${getTableName(table)}`);
};

export const READ = async (db: any, table: Tables, id: any) => {
  return await db.get(
    `SELECT *
                       FROM ${getTableName(table)}
                       WHERE id = ?`,
    id,
  );
};

export const CREATE = async (db: any, table: Tables, data: any = {}) => {
  const insert = Object.keys(data)
    .map(() => `?`)
    .join(", ");
  return await db.run(
    `INSERT INTO ${getTableName(table)}
                       VALUES (${insert})`,
    [...Object.values(data)],
  );
};

export const UPDATE = async (
  db: any,
  table: Tables,
  id: any,
  data: any = {},
) => {
  const tableConfig = getTableConfigFillable(table);
  const insert = Object.keys(data)
    .map((key) => {
      const columnConfig = tableConfig.find((item: any) => item.name === key);
      if (columnConfig?.type === "string") {
        return `${key}='${data[key]}'`;
      } else if (columnConfig?.type === "number") {
        return `${key}=${Number(data[key])}`;
      } else if (columnConfig?.type === "boolean") {
        return `${key}=${data[key] ? 1 : 0}`;
      } else {
        return `${key}=${data[key]}`;
      }
    })
    .join(", ");
  return await db.run(
    `UPDATE ${getTableName(table)}
                       SET ${insert}
                       WHERE id = ?`,
    [id],
  );
};

export const REMOVE = async (db: any, table: Tables, id: any) => {
  return await db.get(
    `DELETE
                       FROM ${table}
                       WHERE id = ?`,
    id,
  );
};

export const tables = {
  FILES: "FILES",
  USERS: "USERS",
  PERMISSIONS: "PERMISSIONS",
  USER_PERMISSIONS: "USER_PERMISSIONS",
} as const;

export type Tables = keyof typeof tables;

export const getTableName = (table: Tables) => env.db_config.tables?.[table];

export const tableConfig = {
  [tables.FILES]: {
    table: {
      id: "number",
      name: "string",
      size: "number",
      src: "string",
      provider: "string",
      is_preview: "boolean",
      lastModified: "string",
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

export const getTableConfig = (table: Tables) =>
  Object.entries(tableConfig[table]?.table)?.map((table: Array<any>) => {
    return {
      type: table[1],
      name: table[0],
    };
  });

export const getTableConfigFillable = (table: Tables) =>
  Object.entries(tableConfig[table]?.fillable)?.map((table: Array<any>) => {
    return {
      type: table[1],
      name: table[0],
    };
  });
