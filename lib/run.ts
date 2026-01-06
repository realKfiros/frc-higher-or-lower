import {tbaGet} from "@/lib/tba";
import {getTeamBannerCount} from "@/lib/banners";
import {getJson, setJson} from "@/lib/kv";
import {getRandomTeamKey, getRound} from "@/lib/round";
import {TeamRound} from "@/lib/interfaces/game";

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

type RunState = {
	runId: string;
	playerId: string;
	streak: number;
	maxStreak: number;
	aKey: string;
	bKey: string;
	aBanners: number;
	bBanners: number;
	updatedAt: number;
};

async function getTeam(teamKey: string): Promise<TeamSimple> {
	return tbaGet<TeamSimple>(`/team/${teamKey}`);
}

export async function createRun(playerId: string): Promise<PublicRound> {
	const runId =
		typeof crypto !== "undefined" && "randomUUID" in crypto
			? crypto.randomUUID()
			: `${Date.now()}-${Math.random().toString(16).slice(2)}`;

	const { aTeam, bTeam, aBanners, bBanners, keyA, keyB } = await getRound();

	const state: RunState = {
		runId,
		playerId,
		streak: 0,
		maxStreak: 0,
		aKey: keyA,
		bKey: keyB,
		aBanners,
		bBanners,
		updatedAt: Date.now(),
	};

	await setJson(`run:${runId}`, state);

	return {
		runId,
		a: { ...aTeam, banners: aBanners },
		b: { ...bTeam }, // without banners
		streak: 0,
		maxStreak: 0,
	};
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

export async function guessRun(
	runId: string,
	playerId: string,
	dir: "higher" | "lower"
): Promise<{ correct: boolean; revealBanners: number; round: PublicRound }> {
	const state = await loadRun(runId);
	if (!state) {
		throw new Error("Run not found/expired");
	}
	if (state.playerId !== playerId) {
		throw new Error("Run does not belong to player");
	}

	const correct =
		dir === "higher" ? state.bBanners >= state.aBanners : state.bBanners <= state.aBanners;

	const revealBanners = state.bBanners;

	if (!correct) {
		const round: PublicRound = {
			runId,
			a: { ...(await getTeam(state.aKey)), banners: state.aBanners },
			b: { ...(await getTeam(state.bKey)), banners: state.bBanners },
			streak: state.streak,
			maxStreak: state.maxStreak,
		};
		return { correct, revealBanners, round };
	}

	// correct: b becomes a and we get a new b
	const nextStreak = state.streak + 1;
	const nextMax = Math.max(state.maxStreak, nextStreak);

	const nextAKey = state.bKey;

	const nextATeam = await getTeam(nextAKey);
	const nextABanners = await getTeamBannerCount(nextAKey);

	const { bTeam, bBanners, keyB } = await (async () => {
		// new opponent
		let newB = await getRandomTeamKey(nextABanners);
		while (newB === nextAKey) {
			newB = await getRandomTeamKey(nextABanners);
		}
		const [t, c] = await Promise.all([getTeam(newB), getTeamBannerCount(newB)]);
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
