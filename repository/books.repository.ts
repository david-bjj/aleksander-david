import { Database } from "bun:sqlite";
import { Book, BookRequest } from "./entities";

const db = new Database("books.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS books (
        bookId INTEGER PRIMARY KEY AUTOINCREMENT,
        title CHAR(40),
        subject CHAR(40),
        author CHAR(40),
        language CHAR(40)
    )
`);


function createBook(book: BookRequest): Book {
    const stmt = db.prepare("INSERT INTO books (title, subject, author, language) VALUES (?, ?, ?, ?)");
    const result = stmt.run(book.title, book.subject, book.author, book.language);
    return {
        bookId: Number(result.lastInsertRowid),
        ...book,
    };
}

function getAllBooks(): Book[] {
    return getBooksStatement.all();
}

const getBooksStatement = db.prepare<Book, []>(
    "SELECT * FROM books",
)

const getBookStatement = db.prepare<Book, [number]>(
    "SELECT * FROM books WHERE bookId = ?",
);

export function getBook(bookId: number): Book | null {
    return getBookStatement.get(bookId);
}

export { getAllBooks, createBook };