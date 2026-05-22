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

export { Book, BookIssues, BookIssuesRequest, Member, MemberRegisterRequest };