export const TBA_BASE = "https://www.thebluealliance.com/api/v3";

export async function tbaGet<T>(path: string, returnOnError?: T): Promise<T> {
	const key = process.env.TBA_AUTH_KEY;
	if (!key) {
		throw new Error("Missing TBA_AUTH_KEY env var");
	}

	const res = await fetch(`${TBA_BASE}${path}`, {
		headers: {
			"X-TBA-Auth-Key": key,
			"User-Agent": "frc-higher-lower-banners/1.0",
		},
		next: { revalidate: 60 * 60 * 24 },
	});

	if (!res.ok)
	{
		if (returnOnError !== undefined) {
			return returnOnError;
		}
		throw new Error(`TBA ${res.status} for ${path}`);
	}

	return (await res.json()) as T;
}

