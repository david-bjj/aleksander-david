import { Database } from "bun:sqlite";
import { BookIssuesRequest } from "./entities";

const db = new Database("book-issues.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS bookIssues (
        issueId INTEGER PRIMARY KEY AUTOINCREMENT,
        memberId INTEGER NOT NULL,
        bookId INTEGER NOT NULL,
        issueDate TEXT NOT NULL
    )
`);


function issueBook(issueRequest: BookIssuesRequest) {
    const memberCheck = db.prepare("SELECT * FROM members WHERE memberId = ?");
    const memberCheckResult = memberCheck.get(issueRequest.memberId);
    const bookCheck = db.prepare("SELECT * FROM books WHERE bookId = ?");
    const bookCheckResult = bookCheck.get(issueRequest.bookId);
    if (!memberCheckResult || !bookCheckResult) {
        throw new Error("Invalid memberId or bookId");
    }
    const memberActiveIssues = db.prepare("SELECT COUNT(*) FROM bookIssues WHERE memberId = ?");
    const memberActiveIssuesResult = memberActiveIssues.get(issueRequest.memberId);
    if (memberActiveIssuesResult >= 3) {
        throw new Error("Member has already issued 3 books");
    }
}