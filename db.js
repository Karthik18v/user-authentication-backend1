const sqlite3 = require("sqlite3").verbose();

const connectDb = () => {
  const db = new sqlite3.Database("./myDatabase.db", (err) => {
    if (err) {
      console.log("Error opening database", err.message);
    } else {
      console.log("connected to sqlite Database.");
    }
  });

  db.run(
    `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `,
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        console.log("Users table created or already exists.");
      }
    }
  );
};

connectDb();

module.exports = connectDb;
