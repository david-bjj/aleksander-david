import { Elysia, t } from "elysia";
import { registerMember } from "../repository/members.repository";

export const membersController = new Elysia().post("/register", ({ body }) =>
    registerMember(body),

    {
        body: t.Object({
            name: t.String({ minLength: 3 }),
            email: t.String({ format: "email" }),
            phone: t.String({ minLength: 8 }),
            address: t.String({ minLength: 5 }),
        }),
    },
);
