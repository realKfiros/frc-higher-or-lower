import { makeAutoObservable, runInAction } from "mobx";
import {Guess, TeamRound} from "@/lib/interfaces/game";
import {loadBest, saveBest} from "@/lib/localProfile";

export class GameStore {
	a: TeamRound | null = null;
	b: TeamRound | null = null;

	streak = 0;
	best = 0;

	reveal = false;
	isGameOver = false;
	loading = false;

	constructor() {
		makeAutoObservable(this);
		if (typeof window !== "undefined") {
			this.best = loadBest();
		}
	}

	async start() {
		runInAction(() => {
			this.streak = 0;
			this.reveal = false;
			this.isGameOver = false;
		});
		await this.nextRound();
	}

	async nextRound() {
		runInAction(() => {
			this.loading = true;
			this.reveal = false;
		});

		let url = "/api/round";
		if (this.b) {
			url += `/${this.b.key}`;
			this.a = this.b;
			this.b = null;
		}
		const res = await fetch(url, { cache: "no-store" });
		const data = (await res.json()) as { a: TeamRound; b: TeamRound };

		runInAction(() => {
			this.a = data.a;
			this.b = data.b;
			this.loading = false;
		});
	}

	guess(dir: Guess) {
		if (!this.a || !this.b || this.loading || this.isGameOver) return;

		const correct = dir === "higher" ? this.b.banners >= this.a.banners : this.b.banners <= this.a.banners;

		this.reveal = true;

		if (correct) {
			this.streak += 1;
			this.best = Math.max(this.best, this.streak);

			setTimeout(() => this.nextRound(), 850);
		} else {
			this.best = Math.max(this.best, this.streak);
			this.isGameOver = true;
		}
	}

	private persistBest() {
		if (typeof window !== "undefined") {
			saveBest(this.best);
		}
	}
}

export const gameStore = new GameStore();
