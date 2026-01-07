import teamsByCategories from '@/data/team_lists.json' with {type: 'json'};
import {TeamsLists} from "@/lib/interfaces/category";

export function getTeamBannerCount(category: string, teamKey: string): number {
	return (teamsByCategories as TeamsLists)[category][teamKey];
}
