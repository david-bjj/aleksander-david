import { Database } from "bun:sqlite";

const db = new Database("books.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS books (
        bookId INTEGER PRIMARY KEY AUTOINCREMENT,
        title CHAR(40),
        subject CHAR(40),
        author CHAR(40),
        language CHAR(40)
    )
`);




