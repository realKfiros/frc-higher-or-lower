import {getTeamBannerCount} from "@/lib/banners";
import {TeamSimple} from "@/lib/interfaces/tba";
import {tbaGet} from "@/lib/tba";
import {TeamRound} from "@/lib/interfaces/game";

function pick<T>(arr: T[]) {
	return arr[Math.floor(Math.random() * arr.length)];
}

async function getRandomTeamKey(previousBannerCount: number = -1): Promise<string> {
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

async function getTeamRound(teamKey: string): Promise<TeamRound> {
	const [team, banners] = await Promise.all([
		tbaGet<TeamSimple>(`/team/${teamKey}`),
		getTeamBannerCount(teamKey),
	]);

	return { ...team, banners };
}

export const getRound = async (teamA: string|false = false): Promise<{a: TeamRound, b: TeamRound}> => {
	if (!teamA)
		teamA = await getRandomTeamKey();
	const bannersA = await getTeamBannerCount(teamA);
	let teamB = await getRandomTeamKey(bannersA);
	if (teamB === teamA) {
		return getRound(teamA);
	}
	const [a, b] = await Promise.all([getTeamRound(teamA), getTeamRound(teamB)]);
	return { a, b };
}
