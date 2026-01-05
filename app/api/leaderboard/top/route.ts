import {NextResponse} from "next/server";
import {zrevrangeWithScores, getJson} from "@/lib/kv";
import {flag} from 'country-emoji';

type PlayerProfile = { name?: string; country?: string; favoriteTeam?: number | null };

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);

	const country = flag((searchParams.get("country") || "").trim().toLowerCase());
	const teamStr = (searchParams.get("team") || "").trim();
	const team = teamStr ? Number(teamStr) : null;

	const limit = Math.min(50, Math.max(5, Number(searchParams.get("limit") || 50)));
	const scan = Math.min(400, Math.max(limit, Number(searchParams.get("scan") || 200))); // כמה לסרוק לפני פילטר

	const raw = (await zrevrangeWithScores("lb:banners", 0, scan - 1)).result;

	const pairs: Array<{ playerId: string; score: number }> = [];
	for (let i = 0; i < raw.length; i += 2) {
		pairs.push({ playerId: String(raw[i]), score: Number(raw[i + 1]) });
	}

	const rows = await Promise.all(
		pairs.map(async (p) => {
			const profile = await getJson<PlayerProfile>(`player:${p.playerId}`);
			if (!profile?.name)
				return false;
			return {
				playerId: p.playerId,
				score: p.score,
				name: profile?.name,
				country: profile?.country || "",
				favoriteTeam: profile?.favoriteTeam ?? null,
			};
		})
	);

	const filtered = rows.filter((r) => {
		if (!r) {
			return false;
		}
		if (country && (r.country || "").trim().toLowerCase() !== country) {
			return false;
		}
		return !(team != null && r.favoriteTeam !== team);
	});

	return NextResponse.json({ rows: filtered.slice(0, limit) });
}
