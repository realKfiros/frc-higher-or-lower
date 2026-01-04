import { NextResponse } from "next/server";
import { tbaGet } from "@/lib/tba";
import { isBlueBannerAward } from "@/lib/bannerRules";
import {TbaAward} from "@/lib/interfaces/tba";

type Params = {
	params: Promise<{
		teamKey: string
	}>,
};

export async function GET(_req: Request, { params }: Params) {
	const {teamKey} = await params;

	const awards = await tbaGet<TbaAward[]>(`/team/${teamKey}/awards`);
	const banners = awards.reduce((sum, a) => sum + (isBlueBannerAward(a.award_type) ? 1 : 0), 0);

	return NextResponse.json({ teamKey, banners });
}
