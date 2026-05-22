import { Elysia } from "elysia";
import { membersController } from "./controllers/members.controller";
import { booksController } from "./controllers/books.controller";

const app = new Elysia()
    .onError(({ code, error, set }) => {
        if (code === "NOT_FOUND") {
            set.status = 404;
            return { message: error.message };
        }
    })
    .use(membersController)
    .use(booksController)
    .listen(3000);

console.log(`Server running at ${app.server?.hostname}:${app.server?.port}`);
