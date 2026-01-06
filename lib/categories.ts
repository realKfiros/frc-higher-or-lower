import {Category} from "@/lib/interfaces/category";

type Categories = {
	[key: string]: Category,
};

export default {
	regular: {
		title: "Regular",
		leaderboardKey: "lb:banners",
		filter: (banners: number, yearsParticipated: number) => banners > 0 || yearsParticipated >= 3,
	},
	min1: {
		title: "Min 1 Banner",
		leaderboardKey: "lb:banners:min1",
		filter: (banners: number) => banners >= 1,
	},
	min10: {
		title: "Min 10 Banners",
		leaderboardKey: "lb:banners:min10",
		filter: (banners: number) => banners >= 10,
	},
	min20: {
		title: "Min 20 Banners",
		leaderboardKey: "lb:banners:min20",
		filter: (banners: number) => banners >= 20,
	},
} as Categories;
