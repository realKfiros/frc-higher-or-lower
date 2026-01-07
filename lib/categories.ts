import {Category} from "@/lib/interfaces/category";

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

export default {
	regular: {
		title: "Regular",
		leaderboardKey: "lb:banners",
		filter: (banners: number, yearsParticipated: number) => banners > 0 || yearsParticipated >= 3,
		bannerTypes: Object.values(BannerTypes),
	},
	min1: {
		title: "Min 1 Banner",
		leaderboardKey: "lb:banners:min1",
		filter: (banners: number) => banners >= 1,
		bannerTypes: Object.values(BannerTypes),
	},
	min10: {
		title: "Min 10 Banners",
		leaderboardKey: "lb:banners:min10",
		filter: (banners: number) => banners >= 10,
		bannerTypes: Object.values(BannerTypes),
	},
	min20: {
		title: "Min 20 Banners",
		leaderboardKey: "lb:banners:min20",
		filter: (banners: number) => banners >= 20,
		bannerTypes: Object.values(BannerTypes),
	},
	impact: {
		title: "Impact Award",
		leaderboardKey: "lb:banners:impact",
		filter: (banners: number) => banners > 0,
		bannerTypes: [BannerTypes.CHAIRMANS, BannerTypes.CHAIRMANS_FINALIST],
	},
	winner: {
		title: "Event Wins",
		leaderboardKey: "lb:banners:winner",
		filter: (banners: number) => banners > 0,
		bannerTypes: [BannerTypes.WINNER],
	}
} as Categories;
