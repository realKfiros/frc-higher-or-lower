export type FilterFunction = (bannersCount: number, yearsParticipated: number) => boolean;

export type Category = {
	title: string;
	leaderboardKey: string;
	filter: FilterFunction;
	bannerTypes: number[];
};

export type CategoryTeams = {
	[key: string]: number;
};

export type TeamsLists = {
	[category: string]: CategoryTeams
};
