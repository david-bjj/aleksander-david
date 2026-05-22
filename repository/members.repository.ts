import { Database } from "bun:sqlite";
import { Member, MemberRegisterRequest } from "./models";

export const db = new Database("members.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS members (
        memberId INTEGER PRIMARY KEY AUTOINCREMENT,
        name CHAR(40),
        email CHAR(40),
        phone CHAR(40),
        address CHAR(40)
    )
`);

const insertMemberStatement = db.prepare(`
    INSERT INTO members (name, email, phone, address)
    VALUES (?, ?, ?, ?)
`);

export function registerMember(member: MemberRegisterRequest): Member {
    const result = insertMemberStatement.run(
        member.name,
        member.email,
        member.phone,
        member.address,
    );

    return {
        memberId: Number(result.lastInsertRowid),
        ...member,
    };
}

const getMembersStatement = db.prepare<Member, []>(
    `SELECT * FROM members`,
);

export function getMembers(): Member[] {
    return getMembersStatement.all();
}

const getMemberStatement = db.prepare<Member, [number]>(
    `SELECT * FROM members WHERE memberId = ?`,
);

export function getMember(memberId: number): Member | null {
    return getMemberStatement.get(memberId);
}