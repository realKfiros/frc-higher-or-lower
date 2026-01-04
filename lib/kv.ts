type UpstashRes<T> = { result: T };
type UpstageArrayRes = UpstashRes<Array<string | number>>;

async function upstash<T>(path: string, init?: RequestInit): Promise<T> {
	const url = process.env.UPSTASH_REDIS_REST_URL!;
	const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
	const res = await fetch(`${url}${path}`, {
		...init,
		headers: {
			Authorization: `Bearer ${token}`,
			...(init?.headers || {}),
		},
		cache: "no-store",
	});
	if (!res.ok) throw new Error(`Upstash error ${res.status}`);
	return (await res.json()) as UpstashRes<T> as any;
}

export async function zadd(key: string, score: number, member: string) {
	// ZADD key score member
	return upstash<number>(`/zadd/${encodeURIComponent(key)}/${score}/${encodeURIComponent(member)}`);
}

export async function zrevrangeWithScores(key: string, start: number, stop: number): Promise<UpstageArrayRes> {
	// ZREVRANGE key start stop WITHSCORES
	return upstash(
		`/zrevrange/${encodeURIComponent(key)}/${start}/${stop}/WITHSCORES`
	);
}

export async function setJson(key: string, value: unknown) {
	return upstash<string>(`/set/${encodeURIComponent(key)}/${encodeURIComponent(JSON.stringify(value))}`);
}

export async function getJson<T>(key: string): Promise<T | null> {
	const res = await upstash<string | null>(`/get/${encodeURIComponent(key)}`);
	const raw = (res as any).result as string | null;
	if (!raw) return null;
	try { return JSON.parse(raw) as T; } catch { return null; }
}
