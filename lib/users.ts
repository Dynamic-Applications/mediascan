import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";

export interface User {
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt: string;
}

export interface SafeUser {
    id: string;
    email: string;
    name: string;
    createdAt: string;
}

export async function createTable() {
    await sql`
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    `;
}

export async function createUser(
    email: string,
    name: string,
    password: string,
): Promise<SafeUser> {
    await createTable();
    const passwordHash = await bcrypt.hash(password, 10);
    const { rows } = await sql`
        INSERT INTO users (email, name, password_hash)
        VALUES (${email.toLowerCase().trim()}, ${name.trim()}, ${passwordHash})
        RETURNING id, email, name, created_at
    `;
    return {
        id: rows[0].id,
        email: rows[0].email,
        name: rows[0].name,
        createdAt: rows[0].created_at,
    };
}

export async function findUserByEmail(
    email: string,
): Promise<User | undefined> {
    await createTable();
    const { rows } = await sql`
        SELECT id, email, name, password_hash, created_at
        FROM users WHERE email = ${email.toLowerCase().trim()}
    `;
    if (!rows[0]) return undefined;
    return {
        id: rows[0].id,
        email: rows[0].email,
        name: rows[0].name,
        passwordHash: rows[0].password_hash,
        createdAt: rows[0].created_at,
    };
}

export async function findUserById(id: string): Promise<User | undefined> {
    await createTable();
    const { rows } = await sql`
        SELECT id, email, name, password_hash, created_at
        FROM users WHERE id = ${id}
    `;
    if (!rows[0]) return undefined;
    return {
        id: rows[0].id,
        email: rows[0].email,
        name: rows[0].name,
        passwordHash: rows[0].password_hash,
        createdAt: rows[0].created_at,
    };
}

export async function emailExists(email: string): Promise<boolean> {
    await createTable();
    const { rows } = await sql`
        SELECT 1 FROM users WHERE email = ${email.toLowerCase().trim()}
    `;
    return rows.length > 0;
}

export async function verifyPassword(
    user: User,
    password: string,
): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
}

export function safeUser(user: User): SafeUser {
    const { passwordHash: _, ...safe } = user;
    return safe;
}
