import sqlite3 from "sqlite3";
import {tableConfig} from "./src/config/table.js"

sqlite3.verbose();

const db = new sqlite3.Database(
  "./feathercloud.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      return process.stdout.write(
        `\n\n\r\x1b[31mERROR\x1b[39m > ${err.message}\n`,
      );
    }
  },
);

const generateCreateTableQuery = (tableName, schema) => {
  const columns = Object.entries(schema)
    .map(([name, type]) => `${name} ${type.toUpperCase()}`)
    .join(", ");
  return `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`;
};

const queries = Object.entries(tableConfig).flatMap(([tableName, config]) => [
  `DROP TABLE IF EXISTS ${tableName.toLowerCase()}`,
  generateCreateTableQuery(tableName.toLowerCase(), config.table),
]);

console.log();

queries
  .reduce((promise, query) => {
    return promise.then(() => {
      process.stdout.write(`\r\x1b[33mRUNNING\x1b[39m > ${query}`);
      return new Promise((resolve, reject) => {
        db.run(query, (err) => {
          if (err) {
            process.stdout.clearLine(0);
            process.stdout.write(`\r\x1b[31mFAIL\x1b[39m > ${query}\n`);
            reject(err);
          } else {
            process.stdout.clearLine(0);
            process.stdout.write(`\r\x1b[32mOK\x1b[39m > ${query}\n`);
            resolve();
          }
        });
      });
    });
  }, Promise.resolve())
  .then(() => {
    console.log("\nAll queries executed successfully.");
    db.close();
  })
  .catch((err) => {
    console.error("\nError executing queries:", err);
    db.close();
  });
