import {NextResponse} from "next/server";
import {kv} from "@/lib/kv";

const {zrevrank, zscore, getJson} = kv;

type PlayerProfile = { name?: string; country?: string; favoriteTeam?: number | null };

export async function GET(req: Request) {
	const {searchParams} = new URL(req.url);
	const playerId = (searchParams.get("playerId") || "").trim();
	if (!playerId) return NextResponse.json({ ok: false, error: "Missing playerId" }, { status: 400 });

	const [rankRes, scoreRes, profile] = await Promise.all([
		zrevrank("lb:banners", playerId),
		zscore("lb:banners", playerId),
		getJson<PlayerProfile>(`player:${playerId}`),
	]);

	const rank = rankRes.result; // 0-based
	const score = scoreRes.result;

	if (rank == null || score == null) {
		return NextResponse.json({ ok: true, exists: false });
	}

	return NextResponse.json({
		ok: true,
		exists: true,
		rank: rank + 1,
		score,
		name: profile?.name || "Anonymous",
		country: profile?.country || "",
		favoriteTeam: profile?.favoriteTeam ?? null,
	});
}
