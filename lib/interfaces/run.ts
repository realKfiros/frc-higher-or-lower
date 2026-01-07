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
	isGameOver: boolean;
};

export type RunRecord = 'none'|'personal'|'global';
