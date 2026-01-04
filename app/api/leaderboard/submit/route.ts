import {NextResponse} from "next/server";
import {zadd, setJson} from "@/lib/kv";
import {flag} from 'country-emoji';

type Body = {
	playerId: string;
	best: number;
	name?: string;
	country?: string;
	favoriteTeam?: number | null;
};

export async function POST(req: Request) {
	const body = (await req.json()) as Body;

	const playerId = (body.playerId || "").trim();
	const best = Number(body.best);

	if (!playerId) return NextResponse.json({ ok: false, error: "Missing playerId" }, { status: 400 });
	if (!Number.isFinite(best) || best < 0 || best > 9999)
		return NextResponse.json({ ok: false, error: "Invalid best" }, { status: 400 });

	const countryFlag = flag((body.country || '').slice(0, 32));

	await setJson(`player:${playerId}`, {
		name: body.name?.slice(0, 32) || "Anonymous",
		country: countryFlag || "",
		favoriteTeam: body.favoriteTeam ?? null,
	});

	await zadd("lb:banners", best, playerId);

	return NextResponse.json({ ok: true });
}
