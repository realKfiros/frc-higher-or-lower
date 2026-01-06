export type Category = {
	title: string;
	leaderboardKey: string;
	filter: (banners: number, yearsParticipated: number) => boolean;
};
