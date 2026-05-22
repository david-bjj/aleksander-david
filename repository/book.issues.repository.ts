import { Database } from "bun:sqlite";

const db = new Database("book-issues.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS bookIssues (
        issueId INTEGER PRIMARY KEY AUTOINCREMENT,
        memberId INTEGER NOT NULL,
        bookId INTEGER NOT NULL,
        issueDate TEXT NOT NULL
    )
`);
