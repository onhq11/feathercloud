const sqlite3 = require("sqlite3").verbose();

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

const queries = [
  `DROP TABLE IF EXISTS files`,
  `CREATE TABLE IF NOT EXISTS files ( id INTEGER PRIMARY KEY, name TEXT, size INTEGER, src TEXT, provider TEXT, is_preview INTEGER DEFAULT 0, lastModified TEXT )`,
  `DROP TABLE IF EXISTS users`,
  `CREATE TABLE IF NOT EXISTS users ( id INTEGER PRIMARY KEY, name TEXT, email TEXT, key TEXT )`,
  `DROP TABLE IF EXISTS permissions`,
  `CREATE TABLE IF NOT EXISTS permissions ( id INTEGER PRIMARY KEY, name TEXT, email TEXT, key TEXT )`,
];

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
