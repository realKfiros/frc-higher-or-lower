import { NextResponse } from "next/server";
import { zrevrangeWithScores, getJson } from "@/lib/kv";

type PlayerProfile = { name?: string; country?: string; favoriteTeam?: number | null };

export async function GET() {
	const {result: scores} = await zrevrangeWithScores("lb:banners", 0, 49);

	const pairs: Array<{ playerId: string; score: number }> = [];
	for (let i = 0; i < scores.length; i += 2) {
		pairs.push({ playerId: String(scores[i]), score: Number(scores[i + 1]) });
	}

	const rows = await Promise.all(
		pairs.map(async (p) => {
			const profile = await getJson<PlayerProfile>(`player:${p.playerId}`);
			return {
				playerId: p.playerId,
				score: p.score,
				name: profile?.name || "Anonymous",
				country: profile?.country || "",
				favoriteTeam: profile?.favoriteTeam ?? null,
			};
		})
	);

	return NextResponse.json({ rows });
}
