import { makeAutoObservable, runInAction } from "mobx";
import { profileStore } from "@/stores/profileStore";
import { gameStore } from "@/stores/gameStore";
import { getOrCreatePlayerId } from "@/lib/localProfile";

export type LeaderRow = {
	playerId: string;
	score: number;
	name: string;
	country: string;
	favoriteTeam: number | null;
};

export class LeaderboardStore {
	rows: LeaderRow[] = [];
	loading = false;
	open = false;

	constructor() {
		makeAutoObservable(this);
	}

	toggle(open: boolean) {
		this.open = open;
		if (open) this.refresh();
	}

	async refresh() {
		this.loading = true;
		const res = await fetch("/api/leaderboard/top", { cache: "no-store" });
		const data = (await res.json()) as { rows: LeaderRow[] };
		runInAction(() => {
			this.rows = data.rows;
			this.loading = false;
		});
	}

	async submitMyBest() {
		const playerId = getOrCreatePlayerId();
		const p = profileStore.profile ?? { id: playerId };

		await fetch("/api/leaderboard/submit", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				playerId,
				best: gameStore.best,
				name: p.name,
				country: p.country,
				favoriteTeam: p.favoriteTeam ?? null,
			}),
		});

		await this.refresh();
	}
}

export const leaderboardStore = new LeaderboardStore();
