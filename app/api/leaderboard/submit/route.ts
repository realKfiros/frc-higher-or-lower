import {NextResponse} from "next/server";
import {kv} from "@/lib/kv";
import {loadRun} from "@/lib/run";
import {flag} from "country-emoji";

const {zadd, setJson, zscore, zrevrank} = kv;

type Body = {
	playerId: string;
	runId: string;
	name?: string;
	country?: string;
	favoriteTeam?: number | null;
};

export async function POST(req: Request) {
	const body = (await req.json()) as Body;

	const playerId = (body.playerId || "").trim();
	const runId = (body.runId || "").trim();

	if (!playerId || !runId) {
		return NextResponse.json({ ok: false, error: "Missing playerId/runId" }, { status: 400 });
	}

	const run = await loadRun(runId);
	if (!run) return NextResponse.json({ ok: false, error: "Run expired" }, { status: 400 });
	if (run.playerId !== playerId) {
		return NextResponse.json({ ok: false, error: "Run does not belong to player" }, { status: 400 });
	}

	const currentHighScoreRes = await zscore("lb:banners", playerId);
	const currentHighScore = currentHighScoreRes.result || 0;
	const score = run.maxStreak;
	if (score <= currentHighScore) {
		return NextResponse.json({ ok: true, score: currentHighScore });
	}

	const countryFlag = flag((body.country || '').slice(0, 32));

	await setJson(`player:${playerId}`, {
		name: body.name?.slice(0, 32) || "Anonymous",
		country: countryFlag || "",
		favoriteTeam: body.favoriteTeam ?? null,
	});

	await zadd("lb:banners", score, playerId);

	let record = 'personal';
	const personalRank = await zrevrank("lb:banners", run.playerId);
	if (personalRank.result === 0) {
		record = 'global';
	}

	return NextResponse.json({ ok: true, score, record });
}
