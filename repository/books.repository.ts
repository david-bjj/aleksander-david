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

<<<<<<< Updated upstream
function getBook(bookId: number): Book {
    const stmt = db.prepare("SELECT * FROM books WHERE bookId = ?");
    return stmt.get(bookId);
=======
const getBookStatement = db.prepare<Book, [number]>(
    "SELECT * FROM books WHERE bookId = ?",
);

export function getBook(bookId: number): Book | null {
    return getBookStatement.get(bookId);
>>>>>>> Stashed changes
}

export { getBook, getAllBooks, createBook };