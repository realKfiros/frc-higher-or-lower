import {NextResponse} from "next/server";
import {PlayerProfile} from "@/lib/localProfile";
import {kv} from "@/lib/kv";
import {flag} from "country-emoji";

const {setJson} = kv;

export async function POST(req: Request) {
	const body = (await req.json()) as PlayerProfile;
	const playerId = (body.id || "").trim();
	if (!playerId) {
		return NextResponse.json({ok: false, error: "Missing playerId"}, {status: 400});
	}
	await setJson(`player:${playerId}`, {
		...body,
		country: flag((body.country || '').trim()),
	});
	return NextResponse.json({ ok: true, playerId });
}
