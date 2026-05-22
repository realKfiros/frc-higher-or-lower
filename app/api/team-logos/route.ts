import {NextResponse} from "next/server";
import {getTeamLogos} from "@/lib/teamLogos";
import {normalizeTeamNumbers} from "@/lib/apiValidation";

export async function GET(req: Request) {
	const url = new URL(req.url);
	const teamNumbers = normalizeTeamNumbers(url.searchParams);

	if (!teamNumbers.length) {
		return NextResponse.json({ok: true, teams: {}});
	}

	try {
		const teams = await getTeamLogos(teamNumbers);
		return NextResponse.json({ok: true, teams});
	} catch (e: any) {
		return NextResponse.json(
			{ok: false, error: e?.message || "Could not load team logos"},
			{status: 502},
		);
	}
}
