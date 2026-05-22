import {NextResponse} from "next/server";
import {getTeamColors} from "@/lib/teamColors";
import {normalizeTeamNumbers} from "@/lib/apiValidation";

export async function GET(req: Request) {
	const url = new URL(req.url);
	const teamNumbers = normalizeTeamNumbers(url.searchParams, 20);

	if (!teamNumbers.length) {
		return NextResponse.json({ok: true, teams: {}});
	}

	try {
		const teams = await getTeamColors(teamNumbers);
		return NextResponse.json({ok: true, teams});
	} catch (e: any) {
		return NextResponse.json(
			{ok: false, error: e?.message || "Could not load team colors"},
			{status: 502},
		);
	}
}
