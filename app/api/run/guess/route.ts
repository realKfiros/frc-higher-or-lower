import {NextResponse} from "next/server";
import {guessRun} from "@/lib/run";

export async function POST(req: Request) {
	const body = (await req.json()) as {
		runId: string;
		playerId: string;
		dir: "higher" | "lower";
	};

	const runId = (body.runId || "").trim();
	const playerId = (body.playerId || "").trim();
	const dir = body.dir;

	if (!runId || !playerId) {
		return NextResponse.json({ ok: false, error: "Missing runId/playerId" }, { status: 400 });
	}
	if (dir !== "higher" && dir !== "lower") {
		return NextResponse.json({ ok: false, error: "Invalid dir" }, { status: 400 });
	}

	try {
		const res = await guessRun(runId, playerId, dir);
		return NextResponse.json({ ok: true, ...res });
	} catch (e: any) {
		return NextResponse.json({ ok: false, error: e?.message || "Error" }, { status: 400 });
	}
}
