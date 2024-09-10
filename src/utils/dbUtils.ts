import env from "@/env";
import { tableConfig } from "@/config/table";

export const LIST = async (db: any, table: string) => {
  return await db.all(`SELECT *
    FROM ${getTableName(table)}`);
};

export const READ = async (db: any, table: string, id: any) => {
  return await db.get(
    `SELECT *
     FROM ${getTableName(table)}
     WHERE id = ?`,
    id,
  );
};

export const CREATE = async (db: any, table: string, data: any = {}) => {
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
  table: string,
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

export const REMOVE = async (db: any, table: string, id: any) => {
  return await db.get(
    `DELETE
     FROM ${table}
     WHERE id = ?`,
    id,
  );
};

// @ts-ignore
export const getTableName = (table: any) => env.db_config.tables?.[table];

export const getTableConfig = (table: string) =>
  Object.entries(tableConfig[table]?.table)?.map((table: Array<any>) => {
    return {
      type: table[1],
      name: table[0],
    };
  });

export const getTableConfigFillable = (table: string) =>
  Object.entries(tableConfig[table]?.fillable)?.map((table: Array<any>) => {
    return {
      type: table[1],
      name: table[0],
    };
  });
