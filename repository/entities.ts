interface Book {
    bookId: number;
    title: string;
    subject: string;
    author: string;
    language: string;
}

interface BookIssues {
    issueId: number;
    memberId: number;
    bookId: number;
    issueDate: string;
}

interface BookIssuesRequest {
    memberId: number;
    bookId: number;
}

interface BookIssueSuccessResponse {
    success: true;
    message: string;
    issue: BookIssues;
}

interface BookIssueErrorResponse {
    success: false;
    error: string;
}

interface BookDeletionResponse {
    message: string;
    success: boolean;
}

interface MemberBookIssues {
    member: Member;
    books?: Book[];
}

type BookIssueResponse = BookIssueSuccessResponse | BookIssueErrorResponse;

interface Member {
    memberId: number;
    name: string;
    email: string;
    phone: string;
    address: string;
}

interface MemberRegisterRequest {
    name: string;
    email: string;
    phone: string;
    address: string;
}

export {
    Book,
    BookIssues,
    BookIssuesRequest,
    BookIssueResponse,
    BookIssueSuccessResponse,
    BookIssueErrorResponse,
    Member,
    MemberRegisterRequest,
    MemberBookIssues,
    BookDeletionResponse
};
