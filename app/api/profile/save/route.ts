import {NextResponse} from "next/server";
import {PlayerProfile} from "@/lib/localProfile";
import {kv} from "@/lib/kv";
import {normalizeId, readJsonBody, sanitizeText} from "@/lib/apiValidation";

const {setJson} = kv;

export async function POST(req: Request) {
	const body = await readJsonBody<PlayerProfile>(req);
	if (!body) {
		return NextResponse.json({ok: false, error: "Invalid request"}, {status: 400});
	}

	const playerId = normalizeId(body.id);
	if (!playerId) {
		return NextResponse.json({ok: false, error: "Invalid playerId"}, {status: 400});
	}
	const favoriteTeam = Number(body.favoriteTeam);
	await setJson(`player:${playerId}`, {
		id: playerId,
		name: sanitizeText(body.name, 40),
		favoriteTeam: Number.isInteger(favoriteTeam) && favoriteTeam > 0 && favoriteTeam < 20_000 ? favoriteTeam : null,
	});
	return NextResponse.json({ ok: true, playerId });
}
