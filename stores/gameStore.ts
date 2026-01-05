import {makeAutoObservable, runInAction} from "mobx";
import {loadBest, saveBest, getOrCreatePlayerId} from "@/lib/localProfile";
import type {PublicRound} from "@/lib/run";
import {TeamRound} from "@/lib/interfaces/game";
import {leaderboardStore} from "@/stores/leaderboardStore";

type Guess = "higher" | "lower";

export class GameStore {
	runId?: string;

	a?: TeamRound;
	b?: TeamRound;

	streak = 0;
	best = 0;

	reveal = false;
	revealedBanners: number | null = null;

	isGameOver = false;
	loading = false;

	constructor() {
		makeAutoObservable(this);
		if (typeof window !== "undefined") this.best = loadBest();
	}

	private persistBest() {
		if (typeof window !== "undefined") saveBest(this.best);
	}

	async start() {
		const playerId = getOrCreatePlayerId();

		runInAction(() => {
			this.loading = true;
			this.isGameOver = false;
			this.reveal = false;
			this.revealedBanners = null;
			this.streak = 0;
		});

		const res = await fetch("/api/run/start", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ playerId }),
		});
		const data = (await res.json()) as { ok: boolean; round?: PublicRound };

		if (!data.ok || !data.round) {
			runInAction(() => { this.loading = false; });
			throw new Error("Failed to start run");
		}

		runInAction(() => {
			this.runId = data.round!.runId;
			this.a = data.round!.a;
			this.b = data.round!.b;
			this.streak = data.round!.streak;
			this.loading = false;
		});
	}

	async guess(dir: Guess) {
		if (!this.runId || !this.a || !this.b || this.loading || this.isGameOver) return;

		const playerId = getOrCreatePlayerId();

		runInAction(() => {
			this.loading = true;
			this.reveal = false;
			this.revealedBanners = null;
		});

		const res = await fetch("/api/run/guess", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ runId: this.runId, playerId, dir }),
		});

		const data = (await res.json()) as
			| { ok: false; error: string }
			| { ok: true; correct: boolean; revealBanners: number; round: PublicRound };

		if (!("ok" in data) || data.ok === false) {
			runInAction(() => { this.loading = false; });
			return;
		}

		// reveal
		runInAction(() => {
			this.reveal = true;
			this.revealedBanners = data.revealBanners;
			this.b = { ...this.b!, banners: data.revealBanners };
			this.loading = false;
		});

		if (!data.correct) {
			runInAction(() => {
				this.isGameOver = true;
			});
			await leaderboardStore.submitMyRun();
			const nextBest = Math.max(this.best, this.streak);
			if (nextBest !== this.best) {
				this.best = nextBest; this.persistBest();
			}
			return;
		}

		runInAction(() => {
			this.streak = data.round.streak;
			const nextBest = Math.max(this.best, this.streak);
			if (nextBest !== this.best) {
				this.best = nextBest; this.persistBest();
			}
		});

		setTimeout(() => {
			runInAction(() => {
				this.a = data.round.a;
				this.b = data.round.b;
				this.reveal = false;
				this.revealedBanners = null;
			});
		}, 850);
	}
}

export const gameStore = new GameStore();
