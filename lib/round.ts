import {getTeamBannerCount} from "@/lib/banners";
import {TeamSimple} from "@/lib/interfaces/tba";
import {getRandomTeamKey} from "@/lib/teams";
import {getTeamSummary} from "@/lib/teamInfo";

type Round = {
	aTeam: TeamSimple;
	bTeam: TeamSimple;
	aBanners: number;
	bBanners: number;
	keyA: string;
	keyB: string;
};

export const getRound = async (category: string, keyA: string, arg?: string): Promise<Round> => {
	const bannersA = getTeamBannerCount(category, keyA as string, arg);
	let keyB = getRandomTeamKey(category, bannersA, arg);
	if (keyB === keyA) {
		return getRound(category, keyA, arg);
	}
	const aTeam = getTeamSummary(keyA);
	const bTeam = getTeamSummary(keyB);
	const aBanners = getTeamBannerCount(category, keyA as string, arg);
	const bBanners = getTeamBannerCount(category, keyB, arg);
	return { aTeam, bTeam, aBanners, bBanners, keyA, keyB };
}
