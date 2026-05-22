import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function blacklistToken(token: string): Promise<void> {
    await redis.set(`blacklist:${token}`, "1", { ex: 60 * 60 * 24 * 7 });
}

export async function isTokenBlacklisted(token: string): Promise<boolean> {
    const val = await redis.get(`blacklist:${token}`);
    return val !== null;
}
