import {kv} from "@/lib/kv";
import {RunState} from "@/lib/interfaces/run";
import {getRound} from "@/lib/round";
import categories from "@/lib/categories";
import {tbaGet} from "@/lib/tba";
import {TeamSimple} from "@/lib/interfaces/tba";
import {getRandomTeamKey} from "@/lib/teams";

const {getJson, setJson} = kv;

export const createRun = async (playerId: string, category: string) => {
	const c = categories[category];
	if (!c) {
		throw new Error("Invalid category");
	}

	const runId =
		typeof crypto !== "undefined" && "randomUUID" in crypto
			? crypto.randomUUID()
			: `${Date.now()}-${Math.random().toString(16).slice(2)}`;

	const keyA = getRandomTeamKey(category);

	const { aBanners, bBanners, keyB } = await getRound(category, keyA);

	const maxStreak = await kv.zscore(c.leaderboardKey, playerId);

	const state: RunState = {
		runId,
		playerId,
		streak: 0,
		maxStreak: maxStreak.result ?? 0,
		aKey: keyA,
		bKey: keyB,
		aBanners,
		bBanners,
		category,
		updatedAt: Date.now(),
		isGameOver: false,
	};

	await setJson(`run:${runId}`, state);

	return runId;
};

export const loadRun = async (runId: string) => {
	const state = await getJson<RunState>(`run:${runId}`);
	if (!state) {
		throw new Error("Game not found");
	}

	const aTeam = await tbaGet<TeamSimple>(`/team/${state.aKey}`);
	const bTeam = await tbaGet<TeamSimple>(`/team/${state.bKey}`);

	let bBanners = undefined; // without banners, unless game over
	if (state.isGameOver) {
		bBanners = state.bBanners;
	}

	return {
		runId,
		a: { ...aTeam, banners: state.aBanners },
		b: { ...bTeam, banners: bBanners },
		streak: state.streak,
		maxStreak: state.maxStreak,
		category: state.category,
		isGameOver: state.isGameOver,
	};
};
