import {getTeamsForCategory} from "@/lib/categories";

export const getRandomTeamKey = (category: string, previousBannerCount: number = -1, arg?: string): string => {
	const categoryTeams = getTeamsForCategory(category, arg);
	let teamKeys = Object.keys(categoryTeams);

	if (previousBannerCount >= 0) {
		const differentBannerCount = teamKeys.filter((team) => categoryTeams[team] !== previousBannerCount);
		if (differentBannerCount.length) {
			teamKeys = differentBannerCount;
		}
	}

	const randomIndex = Math.floor(Math.random() * teamKeys.length);
	return teamKeys[randomIndex];
};
