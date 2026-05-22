import { Database } from "bun:sqlite";
import { BookIssuesRequest, BookIssues, Member, Book } from "./entities";

const db = new Database("book-issues.db");

type BookIssuesResponse = {
    success: boolean;
    message: string;
    data?: BookIssues;
}

type MemberBookIssues = {
    member: Member;
    books?: Book[];
}

db.exec(`
    CREATE TABLE IF NOT EXISTS bookIssues (
        issueId INTEGER PRIMARY KEY AUTOINCREMENT,
        memberId INTEGER NOT NULL,
        bookId INTEGER NOT NULL,
        issueDate TEXT NOT NULL
    )
`);


function issueBook(issueRequest: BookIssuesRequest): BookIssuesResponse {
    const memberCheck = db.prepare("SELECT * FROM members WHERE memberId = ?");
    const memberCheckResult = memberCheck.get(issueRequest.memberId);
    const bookCheck = db.prepare("SELECT * FROM books WHERE bookId = ?");
    const bookCheckResult = bookCheck.get(issueRequest.bookId);
    if (!memberCheckResult || !bookCheckResult) {
        return {
            success: false,
            message: "Invalid memberId or bookId"
        }
    }
    const memberActiveIssues = db.prepare("SELECT COUNT(*) FROM bookIssues WHERE memberId = ?");
    const memberActiveIssuesResult = memberActiveIssues.get(issueRequest.memberId);
    if (memberActiveIssuesResult >= 3) {
        return {
            success: false,
            message: "Member cannot issue more than 3 books"
        };
    }
    const bookAlreadyIssued = db.prepare("SELECT * FROM bookIssues WHERE bookId = ?");
    const bookAlreadyIssuedResult = bookAlreadyIssued.get(issueRequest.bookId);
    if (bookAlreadyIssuedResult) {
        return {
            success: false,
            message: "Book is already issued to another member"
        };
    }
    const storeStmt = db.prepare("INSERT INTO bookIssues (memberId, bookId, issueDate) VALUES (?, ?, ?)");
    const currentDate = new Date().toISOString();
    const result = storeStmt.run(issueRequest.memberId, issueRequest.bookId, currentDate);
    return {
        success: true,
        message: "Book issued successfully",
        data: {
            issueId: result.issueId,
            memberId: result.memberId,
            bookId: result.bookId,
            issueDate: currentDate
        }
    }
}

function getAllIssuedBooks(): MemberBookIssues[] {
    const stmt = db.prepare("SELECT memberId FROM bookIssues");
    const memberIds: number[] = stmt.all();
    let memberBookIssuesList: MemberBookIssues[] = [];
    for(const memberId of memberIds) {
        const getMemberStmt = db.prepare("SELECT * FROM members WHERE memberId = ?");
        const member: Member = getMemberStmt.get(memberId);
        const getBookIssuesStmt = db.prepare("SELECT bookId FROM bookIssues WHERE memberId = ?");
        const bookIssueIds: number[] = getBookIssuesStmt.get(memberId);
        let memberBookIssues: MemberBookIssues = {
            member: member,
            books: []
        };
        for (const bookIssueId of bookIssueIds) {
            const getBookStmt = db.prepare("SELECT * FROM books WHERE bookId = ?");
            const book: Book = getBookStmt.get(bookIssueId);
            memberBookIssues.books?.push(book);
        }
        memberBookIssuesList.push(memberBookIssues);
    }
    return memberBookIssuesList;
}

function getIssuesByMember(memberId: number): MemberBookIssues {
    const memberSelectStmt = db.prepare("SELECT * FROM members WHERE memberId = ?");
    const member: Member = memberSelectStmt.get(memberId);
    const selectBookIssuesStmt = db.prepare("SELECT bookId FROM bookIssues WHERE memberId = ?");
    const bookIssues: number[] = selectBookIssuesStmt.all(memberId);
    let memberBookIssues: MemberBookIssues = {
        member: member,
        books: []
    };
    for (const bookIssue of bookIssues) {
        const bookSelectStmt = db.prepare("SELECT * FROM books WHERE bookId = ?");
        const book: Book = bookSelectStmt.get(bookIssue);
        memberBookIssues.books?.push(book);
    }
    return memberBookIssues;
}