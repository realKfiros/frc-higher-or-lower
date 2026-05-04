export type FilterFunction = (bannersCount: number, ...args: any[]) => boolean;

export type Subcategories = {
	[key: string]: string[]
}

export type Category = {
	title: string;
	leaderboardKey: (subcategoryKey?: string) => string;
	filter: FilterFunction;
	bannerTypes: number[];
	useCategory?: string;
	subcategories?: Subcategories;
};

export type CategoryTeams = {
	[key: string]: number;
};

export type TeamsLists = {
	[category: string]: CategoryTeams
};
