import { createClient } from "redis";

const client = createClient({
	url: process.env.REDIS_URL || "redis://localhost:6379",
});

client.on("error", (err) => {
	console.error("Redis error", err);
});

if (!client.isOpen) {
	await client.connect();
}

// ---------- Sorted Sets ----------

export async function zadd(key: string, score: number, member: string) {
	return client.zAdd(key, [{ score, value: member }]);
}

export async function zrevrangeWithScores(key: string, start: number, stop: number) {
	const res = await client.zRangeWithScores(key, start, stop, { REV: true });
	// מחזירים בפורמט כמו Upstash: [member, score, member, score...]
	const flat: Array<string | number> = [];
	for (const r of res) {
		flat.push(r.value, r.score);
	}
	return { result: flat };
}

export async function zrevrank(key: string, member: string) {
	const rank = await client.zRevRank(key, member);
	return { result: rank };
}

export async function zscore(key: string, member: string) {
	const score = await client.zScore(key, member);
	return { result: score };
}

// ---------- KV JSON ----------

export async function setJson(key: string, value: unknown) {
	await client.set(key, JSON.stringify(value));
	return { result: "OK" };
}

export async function getJson<T>(key: string): Promise<T | null> {
	const raw = await client.get(key);
	if (!raw) return null;
	try {
		return JSON.parse(raw) as T;
	} catch {
		return null;
	}
}
