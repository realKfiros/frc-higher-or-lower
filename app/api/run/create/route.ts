import {NextResponse} from "next/server";
import {createRun} from "@/actions/run";
import {normalizeCategory, normalizeCategoryArg, normalizeId, readJsonBody} from "@/lib/apiValidation";

export async function POST(req: Request) {
	const body = await readJsonBody<{ playerId: string, category: string, arg?: string }>(req);
	if (!body) {
		return NextResponse.json({ok: false, error: "Invalid request"}, {status: 400});
	}

	const playerId = normalizeId(body.playerId);
	if (!playerId) {
		return NextResponse.json({ok: false, error: "Invalid playerId"}, {status: 400});
	}
	const category = normalizeCategory(body.category);
	if (!category) {
		return NextResponse.json({ok: false, error: "Invalid category"}, {status: 400});
	}
	const arg = normalizeCategoryArg(category, body.arg);

	const runId = await createRun(playerId, category, arg);
	return NextResponse.json({ ok: true, runId });
}
