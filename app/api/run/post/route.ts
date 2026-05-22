import {NextResponse} from "next/server";
import {normalizeId, readJsonBody} from "@/lib/apiValidation";
import {publishRun} from "@/lib/run";

export async function POST(req: Request) {
	const body = await readJsonBody<{
		runId: string;
		playerId: string;
	}>(req);

	if (!body) {
		return NextResponse.json({ok: false, error: "Invalid request"}, {status: 400});
	}

	const runId = normalizeId(body.runId);
	const playerId = normalizeId(body.playerId);

	if (!runId || !playerId) {
		return NextResponse.json({ok: false, error: "Invalid runId/playerId"}, {status: 400});
	}

	try {
		const result = await publishRun(runId, playerId);
		return NextResponse.json({ok: true, ...result});
	} catch (e: any) {
		return NextResponse.json({ok: false, error: e?.message || "Error"}, {status: 400});
	}
}
