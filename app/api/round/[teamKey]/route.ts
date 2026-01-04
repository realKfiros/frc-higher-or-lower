import {NextResponse} from "next/server";
import {getRound} from "@/lib/round";

type Params = {
	params: Promise<{
		teamKey: string
	}>,
};

export async function GET(_req: Request, { params }: Params) {
	const {teamKey} = await params;

	const round = await getRound(teamKey);
	return NextResponse.json(round);
}
