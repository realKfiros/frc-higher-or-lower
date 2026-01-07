import teamsByCategories from '@/data/team_lists.json' with {type: 'json'};
import {TeamsLists} from "@/lib/interfaces/category";

export const getRandomTeamKey = (category: string, previousBannerCount: number = -1): string => {
	const categoryTeams = (teamsByCategories as TeamsLists)[category] ?? [];
	const teamKeys = Object.keys(categoryTeams);
	const randomIndex = Math.floor(Math.random() * teamKeys.length);
	const team = teamKeys[randomIndex];
	if (categoryTeams[team] === previousBannerCount) {
		return getRandomTeamKey(category, previousBannerCount);
	}
	return team;
}
