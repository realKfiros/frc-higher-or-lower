import { makeAutoObservable } from "mobx";
import { loadProfile, saveProfile, type PlayerProfile } from "@/lib/localProfile";

export class ProfileStore {
	profile: PlayerProfile | null = null;
	open = false;

	constructor() {
		makeAutoObservable(this);
		if (typeof window !== "undefined") {
			this.profile = loadProfile();
		}
	}

	toggle(open: boolean) {
		this.open = open;
	}

	update(patch: Partial<PlayerProfile>) {
		if (!this.profile) return;
		const next = { ...this.profile, ...patch };
		this.profile = next;
		if (typeof window !== "undefined") saveProfile(next);
	}

	get displayName() {
		return this.profile?.name?.trim();
	}
}

export const profileStore = new ProfileStore();
