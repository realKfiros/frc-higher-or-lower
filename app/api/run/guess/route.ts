import {NextResponse} from "next/server";
import {guessRun} from "@/lib/run";
import {normalizeId, readJsonBody} from "@/lib/apiValidation";

export async function POST(req: Request) {
	const body = await readJsonBody<{
		runId: string;
		playerId: string;
		dir: "higher" | "lower";
	}>(req);

	if (!body) {
		return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
	}

	const runId = normalizeId(body.runId);
	const playerId = normalizeId(body.playerId);
	const dir = body.dir;

	if (!runId || !playerId) {
		return NextResponse.json({ ok: false, error: "Invalid runId/playerId" }, { status: 400 });
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
