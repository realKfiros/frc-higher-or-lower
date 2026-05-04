import {getTeamsForCategory} from "@/lib/categories";

export const getRandomTeamKey = (category: string, previousBannerCount: number = -1, arg?: string): string => {
	let categoryTeams = getTeamsForCategory(category, arg);
	const teamKeys = Object.keys(categoryTeams);
	const randomIndex = Math.floor(Math.random() * teamKeys.length);
	const team = teamKeys[randomIndex];
	if (categoryTeams[team] === previousBannerCount) {
		return getRandomTeamKey(category, previousBannerCount, arg);
	}
	return team;
};
