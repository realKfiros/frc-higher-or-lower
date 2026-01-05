import {makeAutoObservable, runInAction} from "mobx";
import {profileStore} from "@/stores/profileStore";
import {gameStore} from "@/stores/gameStore";
import {getOrCreatePlayerId} from "@/lib/localProfile";

export type LeaderRow = {
	playerId: string;
	score: number;
	name: string;
	country: string;
	favoriteTeam: number | null;
};

export type MeRow = {
	rank: number;
	score: number;
	name: string;
	country: string;
	favoriteTeam: number | null;
} | null;

export class LeaderboardStore {
	rows: LeaderRow[] = [];
	me: MeRow = null;

	loading = false;
	open = false;

	filterCountry = "";
	filterTeam = "";

	constructor() {
		makeAutoObservable(this);
	}

	toggle(open: boolean) {
		this.open = open;
		if (open) {
			this.refresh();
		}
	}

	setCountry(v: string) {
		this.filterCountry = v;
	}

	setTeam(v: string) {
		this.filterTeam = v;
	}

	private buildQuery() {
		const sp = new URLSearchParams();
		if (this.filterCountry.trim()) sp.set("country", this.filterCountry.trim());
		if (this.filterTeam.trim()) sp.set("team", this.filterTeam.trim());
		sp.set("limit", "50");
		sp.set("scan", "250");
		return sp.toString();
	}

	async refresh() {
		this.loading = true;

		const q = this.buildQuery();
		const [topRes, meRes] = await Promise.all([
			fetch(`/api/leaderboard/top?${q}`, { cache: "no-store" }).then((r) => r.json()),
			fetch(`/api/leaderboard/me?playerId=${encodeURIComponent(getOrCreatePlayerId())}`, {
				cache: "no-store",
			}).then((r) => r.json()),
		]);

		runInAction(() => {
			this.rows = topRes.rows || [];
			this.me = meRes?.exists
				? {
					rank: meRes.rank,
					score: meRes.score,
					name: meRes.name,
					country: meRes.country,
					favoriteTeam: meRes.favoriteTeam,
				}
				: null;
			this.loading = false;
		});
	}

	async submitMyRun() {
		if (!profileStore.displayName)
			return;
		const playerId = getOrCreatePlayerId();
		const p = profileStore.profile ?? { id: playerId };

		if (!gameStore.runId) return; // can't submit a run without a runId

		await fetch("/api/leaderboard/submit", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				playerId,
				runId: gameStore.runId,
				name: p.name,
				country: p.country,
				favoriteTeam: p.favoriteTeam ?? null,
			}),
		});

		await this.refresh();
	}
}

export const leaderboardStore = new LeaderboardStore();
