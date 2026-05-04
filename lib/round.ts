import {getTeamBannerCount} from "@/lib/banners";
import {TeamSimple} from "@/lib/interfaces/tba";
import {tbaGet} from "@/lib/tba";
import {getRandomTeamKey} from "@/lib/teams";
import {getTeamsForCategory} from "@/lib/categories";

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
	const [aTeam, bTeam, aBanners, bBanners] = await Promise.all([
		tbaGet<TeamSimple>(`/team/${keyA}`),
		tbaGet<TeamSimple>(`/team/${keyB}`),
		getTeamBannerCount(category, keyA as string, arg),
		getTeamBannerCount(category, keyB, arg),
	]);
	return { aTeam, bTeam, aBanners, bBanners, keyA, keyB };
}
