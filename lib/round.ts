import {getTeamBannerCount} from "@/lib/banners";
import {TeamSimple} from "@/lib/interfaces/tba";
import {tbaGet} from "@/lib/tba";
import {getRandomTeamKey} from "@/lib/teams";

type Round = {
	aTeam: TeamSimple;
	bTeam: TeamSimple;
	aBanners: number;
	bBanners: number;
	keyA: string;
	keyB: string;
};

export const getRound = async (category: string, keyA: string): Promise<Round> => {
	const bannersA = getTeamBannerCount(category, keyA as string);
	let keyB = getRandomTeamKey(category, bannersA);
	if (keyB === keyA) {
		return getRound(category, keyA);
	}
	const [aTeam, bTeam, aBanners, bBanners] = await Promise.all([
		tbaGet<TeamSimple>(`/team/${keyA}`),
		tbaGet<TeamSimple>(`/team/${keyB}`),
		getTeamBannerCount(category, keyA as string),
		getTeamBannerCount(category, keyB),
	]);
	return { aTeam, bTeam, aBanners, bBanners, keyA, keyB };
}
