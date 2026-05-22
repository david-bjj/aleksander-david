import { Elysia } from "elysia";
import { membersController } from "./controllers/members.controller";

const app = new Elysia().use(membersController).listen(3000);

console.log(`Server running at ${app.server?.hostname}:${app.server?.port}`);
