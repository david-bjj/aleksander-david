import { Elysia, NotFoundError, t } from "elysia";
import { getAllBooks, getBook, createBook } from "../repository/books.repository";
import { Book } from "../repository/models";

const allowedLanguages = ["English", "Arabic", "French", "German", "Spanish"];

export const booksController = new Elysia()
    .get("/books", () => {
        return getAllBooks();
    })

    .get("/books/:bookId", ({ params }): Book => {
        const result = getBook(parseInt(params.bookId));
        if (!result) {
            throw new NotFoundError(`Book with id ${params.bookId} not found`);
        }
        return result;
    })

    .post("/books", ({ body }) => {
        if (!allowedLanguages.includes(body.language)) {
            throw new Error(`Language ${body.language} is not allowed.`)
        }
        return createBook(body);
    },
        {
            body: t.Object({
                title: t.String({ minLength: 2 }),
                subject: t.String({ minLength: 2 }),
                author: t.String({ minLength: 3 }),
                language: t.String(),
            })
        }
    );


