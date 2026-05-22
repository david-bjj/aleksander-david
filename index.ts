import { Elysia } from "elysia";
import { membersController } from "./controllers/members.controller";
import { booksController } from "./controllers/books.controller";
import { issuesController } from "./controllers/issues.controller";

const app = new Elysia()
    .onError(({ error, code, set }) => {
        if (code === "NOT_FOUND") {
            set.status = 404;
            return { message: error.message };
        }
    })
    .use(membersController)
    .use(booksController)
    .use(issuesController)
    .listen(3000);

console.log(`Server running at ${app.server?.hostname}:${app.server?.port}`);
