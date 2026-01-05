import {getTeamBannerCount} from "@/lib/banners";
import {TeamSimple} from "@/lib/interfaces/tba";
import {tbaGet} from "@/lib/tba";

function pick<T>(arr: T[]) {
	return arr[Math.floor(Math.random() * arr.length)];
}

export async function getRandomTeamKey(previousBannerCount: number = -1): Promise<string> {
	const page = Math.floor(Math.random() * 25);
	const teams = await tbaGet<TeamSimple[]>(`/teams/${page}`);
	const team = pick(teams);
	if (!team) {
		return getRandomTeamKey(previousBannerCount);
	}
	const banners = await getTeamBannerCount(team.key);
	if (previousBannerCount > -1 && banners === previousBannerCount) {
		return getRandomTeamKey(previousBannerCount);
	}
	if (banners > 0) {
		return team.key;
	}

	const yearsParticipated = await tbaGet<number[]>(`/team/${team.key}/years_participated`);
	if (yearsParticipated.length < 3) {
		return getRandomTeamKey(previousBannerCount);
	}

	return team.key;
}

type Round = {
	aTeam: TeamSimple;
	bTeam: TeamSimple;
	aBanners: number;
	bBanners: number;
	keyA: string;
	keyB: string;
};

export const getRound = async (keyA: string|null = null): Promise<Round> => {
	if (!keyA)
		keyA = await getRandomTeamKey();
	const bannersA = await getTeamBannerCount(keyA as string);
	let keyB = await getRandomTeamKey(bannersA);
	if (keyB === keyA) {
		return getRound(keyA);
	}
	const [aTeam, bTeam, aBanners, bBanners] = await Promise.all([
		tbaGet<TeamSimple>(`/team/${keyA}`),
		tbaGet<TeamSimple>(`/team/${keyB}`),
		getTeamBannerCount(keyA as string),
		getTeamBannerCount(keyB),
	]);
	return { aTeam, bTeam, aBanners, bBanners, keyA, keyB };
}
