import {tbaGet} from "@/lib/tba";
import {getTeamBannerCount} from "@/lib/banners";
import {kv} from "@/lib/kv";
import {TeamRound} from "@/lib/interfaces/game";
import {RunRecord, RunState} from "@/lib/interfaces/run";
import {getRandomTeamKey} from "@/lib/teams";
import {submitRun} from "@/actions/leaderboard";

const {getJson, setJson} = kv;

type TeamSimple = {
	key: string;
	team_number: number;
	nickname: string | null;
	name: string | null;
	city?: string | null;
	state_prov?: string | null;
	country?: string | null;
	rookie_year?: number | null;
};

export type PublicRound = {
	runId: string;
	a: TeamRound;
	b: TeamRound; // hidden before guess
	streak: number;
	maxStreak: number;
};

async function getTeam(teamKey: string): Promise<TeamSimple> {
	return tbaGet<TeamSimple>(`/team/${teamKey}`);
}

export async function loadRun(runId: string): Promise<RunState | null> {
	const state = await getJson<RunState>(`run:${runId}`);
	if (!state) {
		return null;
	}

	if (Date.now() - state.updatedAt > 1000 * 60 * 60 * 24) {
		return null;
	}
	return state;
}

type GuessResult = {
	correct: boolean;
	revealBanners: number;
	round: PublicRound;
	record?: RunRecord;
};

export async function guessRun(runId: string, playerId: string, dir: "higher" | "lower"): Promise<GuessResult> {
	const state = await loadRun(runId);
	if (!state) {
		throw new Error("Run not found/expired");
	}
	if (state.playerId !== playerId) {
		throw new Error("Run does not belong to player");
	}

	const correct = dir === "higher" ? state.bBanners >= state.aBanners : state.bBanners <= state.aBanners;

	const revealBanners = state.bBanners;

	if (!correct) {
		const round: PublicRound = {
			runId,
			a: { ...(await getTeam(state.aKey)), banners: state.aBanners },
			b: { ...(await getTeam(state.bKey)), banners: state.bBanners },
			streak: state.streak,
			maxStreak: state.maxStreak,
		};
		await setJson(`run:${runId}`, {
			...state,
			isGameOver: true,
			updatedAt: Date.now(),
		});
		const record = await submitRun(state.playerId, state.category, state.streak, state.arg);
		return { correct, revealBanners, round, record };
	}

	// correct: b becomes a and we get a new b
	const nextStreak = state.streak + 1;
	const nextMax = Math.max(state.maxStreak, nextStreak);

	const nextAKey = state.bKey;

	const nextATeam = await getTeam(nextAKey);
	const nextABanners = getTeamBannerCount(state.category, nextAKey, state.arg);

	const { bTeam, bBanners, keyB } = await (async () => {
		// new opponent
		let newB = getRandomTeamKey(state.category, nextABanners, state.arg);
		while (newB === nextAKey) {
			newB = getRandomTeamKey(state.category, nextABanners, state.arg);
		}
		const [t, c] = await Promise.all([getTeam(newB), getTeamBannerCount(state.category, newB, state.arg)]);
		return { bTeam: t, bBanners: c, keyB: newB };
	})();

	const nextState: RunState = {
		...state,
		streak: nextStreak,
		maxStreak: nextMax,
		aKey: nextAKey,
		bKey: keyB,
		aBanners: nextABanners,
		bBanners,
		updatedAt: Date.now(),
	};

	await setJson(`run:${runId}`, nextState);

	const round: PublicRound = {
		runId,
		a: { ...nextATeam, banners: nextABanners },
		b: { ...bTeam }, // hidden
		streak: nextStreak,
		maxStreak: nextMax,
	};

	return { correct, revealBanners, round };
}
