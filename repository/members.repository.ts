import { Database } from "bun:sqlite";

const db = new Database("members.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS members (
        memberId INTEGER PRIMARY KEY AUTOINCREMENT,
        name CHAR(40),
        email CHAR(40),
        phone CHAR(40),
        address CHAR(40)
    )
`);

