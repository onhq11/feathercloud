import sqlite3 from "sqlite3";
import { tableConfig } from "../src/config/table.ts";
import { seeder } from "../src/config/seeder.ts";

sqlite3.verbose();
console.log();

const db = new sqlite3.Database(
  "./db/feathercloud.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error(`\n\n\r\x1b[31mERROR\x1b[39m > ${err.message}\n`);
    }
  },
);

const convertType = (type: string) => {
  switch (type) {
    case "string":
      return "TEXT";
    case "number":
      return "INTEGER";
    case "boolean":
      return "BOOLEAN";
    case "object":
      return "TEXT";
    default:
      return "TEXT";
  }
};

const generateCreateTableQuery = (tableName: string, schema: any) => {
  const columns = Object.entries(schema)
    .map(
      ([name, type]) =>
        `${name} ${convertType(type as string)}${name === "id" ? " PRIMARY KEY AUTOINCREMENT" : ""}`,
    )
    .join(", ");
  return `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`;
};

const generateInsertQuery = (tableName: string, data: any[]) => {
  const columns = Object.keys(data[0]).join(", ");
  const values = data
    .map(
      (row) =>
        `(${Object.values(row)
          .map((value) =>
            typeof value === "string"
              ? `'${value}'`
              : value === null
                ? "null"
                : value,
          )
          .join(", ")})`,
    )
    .join(", ");
  return `INSERT INTO ${tableName} (${columns}) VALUES ${values}`;
};

const runQueries = async (queries: string[]) => {
  for (const query of queries) {
    await new Promise<void>((resolve, reject) => {
      db.run(query, (err) => {
        if (err) {
          console.error(`\r\x1b[31mFAIL\x1b[39m > ${query}`);
          reject(err);
        } else {
          console.log(`\r\x1b[32mOK\x1b[39m > ${query}`);
          resolve();
        }
      });
    });
  }
};

const initDatabase = async () => {
  const queries = Object.entries(tableConfig).flatMap(([tableName, config]) => [
    `DROP TABLE IF EXISTS ${tableName}`,
    generateCreateTableQuery(tableName, config.table),
  ]);

  Object.entries(seeder).forEach(([tableName, data]) => {
    if (data.length > 0) {
      queries.push(generateInsertQuery(tableName, data));
    }
  });

  try {
    await runQueries(queries);
    db.close();
    console.log("\nAll queries executed successfully.");
  } catch (err) {
    db.close();
    console.error("\nError executing queries:", err);
  }
};

initDatabase();
