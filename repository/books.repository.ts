import { Database } from "bun:sqlite";
import { Book } from "./entities";

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


function createBook(book: Book): Book {
    const stmt = db.prepare("INSERT INTO books (title, subject, author, language) VALUES (?, ?, ?, ?)");
    stmt.run(book.title, book.subject, book.author, book.language);
    return {
        bookId: book.bookId,
        title: book.title,
        subject: book.subject,
        author: book.author,
        language: book.language
    }
}

function getAllBooks(): Book[] {
    const stmt = db.prepare("SELECT * FROM books");
    return stmt.all();
}

function getBookById(bookId: number): Book {
    const stmt = db.prepare("SELECT * FROM books WHERE bookId = ?");
    const result = stmt.get(bookId);
    if (!result) {
        throw new Error(`Book with id ${bookId} not found`);
    }
    return stmt.get(bookId);
}
