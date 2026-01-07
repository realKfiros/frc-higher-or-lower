import {NextResponse} from "next/server";
import categories from "@/lib/categories";
import {createRun} from "@/actions/run";

export async function POST(req: Request) {
	const body = (await req.json()) as { playerId: string, category: string };
	const playerId = (body.playerId || "").trim();
	if (!playerId) {
		return NextResponse.json({ok: false, error: "Missing playerId"}, {status: 400});
	}
	const category = (body.category || "").trim();
	if (!category) {
		return NextResponse.json({ok: false, error: "Missing category"}, {status: 400});
	}
	if (!categories[category]) {
		return NextResponse.json({ok: false, error: "Invalid category"}, {status: 400});
	}

	const runId = await createRun(playerId, category);
	return NextResponse.json({ ok: true, runId });
}
