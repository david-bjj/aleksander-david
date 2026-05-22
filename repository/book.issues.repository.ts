import { Database } from "bun:sqlite";
import { BookIssuesRequest, BookIssues, Member, Book } from "./entities";
import { getMember } from "./members.repository";
import { getBook } from "./books.repository";

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
    const memberCheckResult = getMember(issueRequest.memberId);
    const bookCheckResult = getBook(issueRequest.bookId);
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
        const member: Member | null = getMember(memberId);
        const getBookIssuesStmt = db.prepare("SELECT bookId FROM bookIssues WHERE memberId = ?");
        const bookIssueIds: number[] = getBookIssuesStmt.get(memberId);
        if (!member) {
            throw new Error(`Member with id ${memberId} not found`);
        }
        let memberBookIssues: MemberBookIssues = {
            member: member,
            books: []
        };
        for (const bookIssueId of bookIssueIds) {
            const book: Book = getBook(bookIssueId);
            memberBookIssues.books?.push(book);
        }
        memberBookIssuesList.push(memberBookIssues);
    }
    return memberBookIssuesList;
}

function getIssuesByMember(memberId: number): MemberBookIssues {
    const member: Member | null = getMember(memberId);
    if (!member) {
        throw new Error(`Member with id ${memberId} not found`);
    }
    const selectBookIssuesStmt = db.prepare("SELECT bookId FROM bookIssues WHERE memberId = ?");
    const bookIssues: number[] = selectBookIssuesStmt.all(memberId);
    let memberBookIssues: MemberBookIssues = {
        member: member,
        books: []
    };
    for (const bookIssue of bookIssues) {
        const book: Book = getBook(bookIssue);
        memberBookIssues.books?.push(book);
    }
    return memberBookIssues;
}

function deleteBookIssue(issueId: number): BookIssuesResponse {
    const deleteStmt = db.prepare("DELETE FROM bookIssues WHERE issueId = ?");
    const result = deleteStmt.run(issueId);
    if (result.changes > 0) {
        return {
            success: true,
            message: "Book issue deleted successfully"
        };
    } else {
    return {
        success: false,
        message: `Book issue with id ${issueId} not found`
        };
    }
}