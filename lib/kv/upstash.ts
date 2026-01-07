type UpstashRes<T> = { result: T };

async function upstash<T>(path: string, init?: RequestInit): Promise<UpstashRes<T>> {
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
	return (await res.json()) as UpstashRes<T>;
}

export async function zadd(key: string, score: number, member: string) {
	return upstash<number>(`/zadd/${encodeURIComponent(key)}/${score}/${encodeURIComponent(member)}`);
}

export async function zrevrangeWithScores(key: string, start: number, stop: number) {
	return upstash<Array<string | number>>(
		`/zrevrange/${encodeURIComponent(key)}/${start}/${stop}/WITHSCORES`
	);
}

export async function zrevrank(key: string, member: string) {
	// rank in descending order (0 = best) by using ZREVRANK
	return upstash<number | null>(`/zrevrank/${encodeURIComponent(key)}/${encodeURIComponent(member)}`);
}

export async function zscore(key: string, member: string) {
	return upstash<number | null>(`/zscore/${encodeURIComponent(key)}/${encodeURIComponent(member)}`);
}

export async function setJson(key: string, value: unknown) {
	return upstash<string>(
		`/set/${encodeURIComponent(key)}/${encodeURIComponent(JSON.stringify(value))}`
	);
}

export async function getJson<T>(key: string): Promise<T | null> {
	const res = await upstash<string | null>(`/get/${encodeURIComponent(key)}`);
	const raw = res.result;
	if (!raw) return null;
	try { return JSON.parse(raw) as T; } catch { return null; }
}
