import { Database } from "bun:sqlite";
import {
    BookIssueResponse,
    BookIssuesRequest,
    MemberBookIssues,
    IssuedBook,
    Member,
    BookDeletionResponse
} from "./models";
import { getBook } from "./books.repository";
import { getMember } from "./members.repository";
import { NotFoundError } from "elysia";

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

const getIssueByBookIdStatement = db.prepare(
    "SELECT issueId FROM bookIssues WHERE bookId = ?",
);

const insertIssueStatement = db.prepare(
    "INSERT INTO bookIssues (memberId, bookId, issueDate) VALUES (?, ?, ?)",
);

const getIssuesByMemberStatement = db.prepare<{ issueId: number; bookId: number; issueDate: string }, [number]>
("SELECT issueId, bookId, issueDate FROM bookIssues WHERE memberId = ?");

const getDistinctMemberIdsStatement = db.prepare<{ memberId: number }, []>(
    "SELECT DISTINCT memberId FROM bookIssues",
);

function currentIssueDate(): string {
    return new Date().toISOString();
}

export function issueBook(request: BookIssuesRequest): BookIssueResponse {
    if (!getMember(request.memberId) || !getBook(request.bookId)) {
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
    const issues = getIssuesByMemberStatement.all(member.memberId);
    const books = issues
        .map((row): IssuedBook | null => {
            const book = getBook(row.bookId);

            if (!book) {
                throw new NotFoundError(`Book with ${row.bookId} not found`);
            } 

            return { ...book, issueId: row.issueId, issueDate: row.issueDate };
        })
        .filter((book): book is IssuedBook => book !== null);
    return {
        member,
        books,
    };
}

export function deleteBookIssue(issueId: number): BookDeletionResponse {
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
