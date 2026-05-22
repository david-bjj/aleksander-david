import { Database } from "bun:sqlite";
import { Member, MemberRegisterRequest } from "./entities";

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

const insertMember = db.prepare(`
    INSERT INTO members (name, email, phone, address)
    VALUES (?, ?, ?, ?)
`);

export function registerMember(member: MemberRegisterRequest): Member {
    const result = insertMember.run(
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

