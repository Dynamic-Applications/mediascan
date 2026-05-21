declare global {
    var __blacklistedTokens: Set<string>;
}

if (!global.__blacklistedTokens) {
    global.__blacklistedTokens = new Set();
}

export function blacklistToken(token: string): void {
    global.__blacklistedTokens.add(token);
}

export function isTokenBlacklisted(token: string): boolean {
    return global.__blacklistedTokens.has(token);
}
