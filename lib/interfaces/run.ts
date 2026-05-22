export type RunState = {
	runId: string;
	playerId: string;
	streak: number;
	maxStreak: number;
	aKey: string;
	bKey: string;
	aBanners: number;
	bBanners: number;
	updatedAt: number;
	category: string;
	arg?: string;
	isGameOver: boolean;
	postedToLeaderboard?: boolean;
};

export type RunRecord = 'none'|'personal'|'global';
export type PublishResult = RunRecord|'missing-profile'|'already-posted';
