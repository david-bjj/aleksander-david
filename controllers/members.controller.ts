import { Elysia, NotFoundError, t } from "elysia";
import { registerMember, getMembers, getMember } from "../repository/members.repository";
import { Member } from "../repository/entities";

export const membersController = new Elysia()
    .post(
        "/register",
        ({ body }) => registerMember(body),
        {
            body: t.Object({
                name: t.String({ minLength: 3 }),
                email: t.String({ format: "email" }),
                phone: t.String({ minLength: 8 }),
                address: t.String({ minLength: 5 }),
            }),
        },
    )
    .group("/members", (app) =>
        app
            .get("/", (): Member[] => getMembers())
            .get(
                "/:memberId",
                ({ params: { memberId } }): Member => {
                    const member = getMember(memberId);

                    if (!member) {
                        throw new NotFoundError(
                            `Member with id ${memberId} not found`,
                        );
                    }

                    return member;
                },
                {
                    params: t.Object({
                        memberId: t.Numeric(),
                    }),
                },
            ),
    );
