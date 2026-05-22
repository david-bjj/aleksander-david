import { Elysia, NotFoundError, t } from "elysia";
import {
    issueBook,
    getIssuesByMember,
    deleteBookIssue,
    getAllIssues
} from "../repository/book.issues.repository";
import { getMember } from "../repository/members.repository";
import { Member } from "../repository/models";

export const issuesController = new Elysia()
    .group("/issues", (app) =>
        app
            .post(
                "/",
                ({ body, set }) => {
                    const result = issueBook(body);

                    if (!result.success) {
                        set.status = 400;
                    }

                    return result;
                },
                {
                    body: t.Object({
                        memberId: t.Numeric(),
                        bookId: t.Numeric(),
                    }),
                },
            )
            .delete(
                "/:issueId",
                ({ params: { issueId }, set }) => {
                    const result = deleteBookIssue(issueId);

                    if (!result.success) {
                        set.status = 404;
                    }

                    return result;
                },
                {
                    params: t.Object({
                        issueId: t.Numeric(),
                    }),
                },
            )
            .get("/", () => {
                return getAllIssues();
            })
    )
    .group("/members", (app) =>
        app.get(
            "/:memberId/issues",
            ({ params: { memberId } }) => {
                const member: Member | null = getMember(memberId);

                if (!member) {
                    throw new NotFoundError(
                        `Member with id ${memberId} not found`,
                    );
                }

                return getIssuesByMember(member);
            },
            {
                params: t.Object({
                    memberId: t.Numeric(),
                }),
            },
        ),
    );
