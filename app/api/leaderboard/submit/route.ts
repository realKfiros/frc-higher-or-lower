import {NextResponse} from "next/server";
import {zadd, setJson} from "@/lib/kv";
import {loadRun} from "@/lib/run";
import {flag} from "country-emoji";

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

	const score = run.maxStreak;

	const countryFlag = flag((body.country || '').slice(0, 32));

	await setJson(`player:${playerId}`, {
		name: body.name?.slice(0, 32) || "Anonymous",
		country: countryFlag || "",
		favoriteTeam: body.favoriteTeam ?? null,
	});

	await zadd("lb:banners", score, playerId);

	return NextResponse.json({ ok: true, score });
}
