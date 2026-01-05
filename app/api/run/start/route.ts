import {NextResponse} from "next/server";
import {createRun} from "@/lib/run";

export async function POST(req: Request) {
	const body = (await req.json()) as { playerId: string };
	const playerId = (body.playerId || "").trim();
	if (!playerId) return NextResponse.json({ ok: false, error: "Missing playerId" }, { status: 400 });

	const round = await createRun(playerId);
	return NextResponse.json({ ok: true, round });
}
