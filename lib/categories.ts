import {Category, Subcategories, TeamsLists} from "@/lib/interfaces/category";
import countries from '@/data/countries.json' with {type: 'json'};
import provinces from '@/data/provinces.json' with {type: 'json'};
import teamsByCategories from '@/data/team_lists.json' with {type: 'json'};

type Categories = {
	[key: string]: Category,
};

export enum BannerTypes {
	CHAIRMANS = 0,
	CHAIRMANS_FINALIST = 69,
	WINNER = 1,
	WOODIE_FLOWERS = 3,
	SKILLS_COMPETITION_WINNER = 74,
	GAME_DESIGN_CHALLENGE_WINNER = 80,
}

const getRelevantSubcategories = (subcategories: Subcategories)=> {
	const relevantSubcategories: Subcategories = {};
	for (const [subcategory, teams] of Object.entries(subcategories)) {
		if (teams.length > 20) {
			relevantSubcategories[subcategory] = teams;
		}
	}
	return relevantSubcategories;
}

const categories = {
	regular: {
		title: "Regular",
		leaderboardKey: () => "lb:banners",
		filter: (banners: number, yearsParticipated: number) => banners > 0 || yearsParticipated >= 3,
		bannerTypes: Object.values(BannerTypes),
	},
	min1: {
		title: "Min 1 Banner",
		leaderboardKey: () => "lb:banners:min1",
		filter: (banners: number) => banners >= 1,
		bannerTypes: Object.values(BannerTypes),
	},
	min10: {
		title: "Min 10 Banners",
		leaderboardKey: () => "lb:banners:min10",
		filter: (banners: number) => banners >= 10,
		bannerTypes: Object.values(BannerTypes),
	},
	min20: {
		title: "Min 20 Banners",
		leaderboardKey: () => "lb:banners:min20",
		filter: (banners: number) => banners >= 20,
		bannerTypes: Object.values(BannerTypes),
	},
	impact: {
		title: "Impact Award",
		leaderboardKey: () => "lb:banners:impact",
		filter: (banners: number) => banners > 0,
		bannerTypes: [BannerTypes.CHAIRMANS, BannerTypes.CHAIRMANS_FINALIST],
	},
	winner: {
		title: "Event Wins",
		leaderboardKey: () => "lb:banners:winner",
		filter: (banners: number) => banners > 0,
		bannerTypes: [BannerTypes.WINNER],
	},
	byCountry: {
		title: "Filter by Country",
		leaderboardKey: (country: string) => `lb:banners:country:${country}`,
		filter: () => true,
		bannerTypes: Object.values(BannerTypes),
		useCategory: 'regular',
		subcategories: getRelevantSubcategories(countries),
	},
	byProvince: {
		title: "Filter by Province",
		leaderboardKey: (province: string) => `lb:banners:province:${province}`,
		filter: () => true,
		bannerTypes: Object.values(BannerTypes),
		useCategory: 'regular',
		subcategories: getRelevantSubcategories(provinces),
	}
} as Categories;

export const getTeamsForCategory = (category: string, arg?: string)=> {
	const checkCategory = categories[category].useCategory || category;
	let categoryTeams = (teamsByCategories as TeamsLists)[checkCategory] ?? [];
	if (arg) {
		const countryTeams = (countries as { [country: string]: string[] })[arg] ?? [];
		for (const team in categoryTeams) {
			if (!countryTeams.includes(team))
				delete categoryTeams[team];
		}
	}
	return categoryTeams;
}

export default categories;