import {getTeamBannerCount} from "@/lib/banners";
import {TeamSimple} from "@/lib/interfaces/tba";
import {tbaGet} from "@/lib/tba";
import {TeamRound} from "@/lib/interfaces/game";

function pick<T>(arr: T[]) {
	return arr[Math.floor(Math.random() * arr.length)];
}

async function getRandomTeamKey(): Promise<string> {
	const page = Math.floor(Math.random() * 25);
	const teams = await tbaGet<TeamSimple[]>(`/teams/${page}/simple`);
	const team = pick(teams);
	const banners = await getTeamBannerCount(team.key);
	const yearsParticipated = await tbaGet<number[]>(`/team/${team.key}/years_participated`);
	if (yearsParticipated.length < 3 && banners < 1) {
		return getRandomTeamKey();
	}

	return team.key;
}

async function getTeamRound(teamKey: string): Promise<TeamRound> {
	const [team, banners] = await Promise.all([
		tbaGet<TeamSimple>(`/team/${teamKey}/simple`),
		getTeamBannerCount(teamKey),
	]);

	return { ...team, banners };
}

export const getRound = async (teamA: string|false = false): Promise<{a: TeamRound, b: TeamRound}> => {
	if (!teamA)
		teamA = await getRandomTeamKey();
	let teamB = await getRandomTeamKey();
	if (teamB === teamA) {
		return getRound(teamA);
	}
	const [a, b] = await Promise.all([getTeamRound(teamA), getTeamRound(teamB)]);
	return { a, b };
}
