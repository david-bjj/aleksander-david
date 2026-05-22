import { Database } from "bun:sqlite";
<<<<<<< Updated upstream
import { BookIssuesRequest, BookIssues, Member, Book } from "./entities";
import { getMember } from "./members.repository";
import { getBook } from "./books.repository";
=======
import {
    BookIssueResponse,
    BookIssuesRequest,
    MemberBookIssues,
    Book,
    Member,
    BookDeletionResponse
} from "./entities";
import { getBook } from "./books.repository";
import { getMember } from "./members.repository";
>>>>>>> Stashed changes

const db = new Database("book-issues.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS bookIssues (
        issueId INTEGER PRIMARY KEY AUTOINCREMENT,
        memberId INTEGER NOT NULL,
        bookId INTEGER NOT NULL,
        issueDate TEXT NOT NULL
    )
`);

const countMemberIssuesStatement = db.prepare<{ count: number }, [number]>(
    "SELECT COUNT(*) as count FROM bookIssues WHERE memberId = ?",
);

<<<<<<< Updated upstream
function issueBook(issueRequest: BookIssuesRequest): BookIssuesResponse {
    const memberCheckResult = getMember(issueRequest.memberId);
    const bookCheckResult = getBook(issueRequest.bookId);
    if (!memberCheckResult || !bookCheckResult) {
=======
const getIssueByBookIdStatement = db.prepare(
    "SELECT issueId FROM bookIssues WHERE bookId = ?",
);

const insertIssueStatement = db.prepare(
    "INSERT INTO bookIssues (memberId, bookId, issueDate) VALUES (?, ?, ?)",
);

const getBookIdsByMemberStatement = db.prepare<{ bookId: number }, [number]>(
    "SELECT bookId FROM bookIssues WHERE memberId = ?",
);

const getDistinctMemberIdsStatement = db.prepare<{ memberId: number }, []>(
    "SELECT DISTINCT memberId FROM bookIssues",
);

function currentIssueDate(): string {
    return new Date().toISOString();
}

export function issueBook(request: BookIssuesRequest): BookIssueResponse {
    if (!getMember(request.memberId) || !getBook(request.bookId)) {
>>>>>>> Stashed changes
        return {
            success: false,
            error: "Invalid memberId or bookId",
        };
    }

    const { count } = countMemberIssuesStatement.get(request.memberId)!;

    if (count >= 3) {
        return {
            success: false,
            error: "member cannot issue more than 3 books",
        };
    }

    if (getIssueByBookIdStatement.get(request.bookId)) {
        return {
            success: false,
            error: "Book is already issued to another member",
        };
    }

    const issueDate = currentIssueDate();
    const result = insertIssueStatement.run(
        request.memberId,
        request.bookId,
        issueDate,
    );

    return {
        success: true,
<<<<<<< Updated upstream
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
=======
        message: "book issue successfully",
        issue: {
            issueId: Number(result.lastInsertRowid),
            memberId: request.memberId,
            bookId: request.bookId,
            issueDate,
        },
    };
}

export function getAllIssues(): MemberBookIssues[] {
    const memberIdRows = getDistinctMemberIdsStatement.all();
    const issues: MemberBookIssues[] = [];

    for (const row of memberIdRows) {
        const member = getMember(row.memberId);

        if (member) {
            issues.push(getIssuesByMember(member));
        }
    }

    return issues;
}

export function getIssuesByMember(member: Member): MemberBookIssues {
    const bookIds = getBookIdsByMemberStatement.all(member.memberId);
    const books = bookIds
        .map((row) => getBook(row.bookId))
        .filter((book): book is Book => book !== null);
    return {
        member,
        books,
    };
}

export function deleteBookIssue(issueId: number): BookDeletionResponse {
>>>>>>> Stashed changes
    const deleteStmt = db.prepare("DELETE FROM bookIssues WHERE issueId = ?");
    const result = deleteStmt.run(issueId);
    if (result.changes > 0) {
        return {
            success: true,
            message: "Book issue deleted successfully"
        };
    } else {
<<<<<<< Updated upstream
    return {
        success: false,
        message: `Book issue with id ${issueId} not found`
        };
    }
}
=======
        return {
            success: false,
            message: `Book issue with id ${issueId} not found`
        };
    }
}
>>>>>>> Stashed changes
