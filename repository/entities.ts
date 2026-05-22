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

export { Book, BookIssues, BookIssuesRequest };