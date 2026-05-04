import {getTeamsForCategory} from "@/lib/categories";

export function getTeamBannerCount(category: string, teamKey: string, arg?: string): number {
	return getTeamsForCategory(category, arg)[teamKey];
}
