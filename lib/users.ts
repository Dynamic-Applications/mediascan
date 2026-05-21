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

declare global {
    var __users: User[];
    var __nextUserId: number;
}

if (!global.__users) {
    global.__users = [];
    global.__nextUserId = 2;
    // seed runs once
    bcrypt.hash("123456", 10).then((hash) => {
        global.__users.push({
            id: "1",
            email: "user@example.com",
            name: "Ahmad",
            passwordHash: hash,
            createdAt: new Date().toISOString(),
        });
    });
}

export async function createUser(
    email: string,
    name: string,
    password: string,
): Promise<SafeUser> {
    const passwordHash = await bcrypt.hash(password, 10);
    const user: User = {
        id: String(global.__nextUserId++),
        email: email.toLowerCase().trim(),
        name: name.trim(),
        passwordHash,
        createdAt: new Date().toISOString(),
    };
    global.__users.push(user);
    return safeUser(user);
}

export async function findUserByEmail(
    email: string,
): Promise<User | undefined> {
    return global.__users.find((u) => u.email === email.toLowerCase().trim());
}

export function findUserById(id: string): User | undefined {
    return global.__users.find((u) => u.id === id);
}

export function getAllUsers(): SafeUser[] {
    return global.__users.map(safeUser);
}

export async function verifyPassword(
    user: User,
    password: string,
): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
}

export function emailExists(email: string): boolean {
    return global.__users.some((u) => u.email === email.toLowerCase().trim());
}

export function safeUser(user: User): SafeUser {
    const { passwordHash: _, ...safe } = user;
    return safe;
}
