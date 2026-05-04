import { makeAutoObservable } from "mobx";
import { loadProfile, saveProfile, type PlayerProfile } from "@/lib/localProfile";

export class ProfileStore {
	profile: PlayerProfile | null = null;
	open = false;
	recordOpened = false;

	constructor() {
		makeAutoObservable(this);
		if (typeof window !== "undefined") {
			this.profile = loadProfile();
		}
	}

	toggle(open: boolean, recordOpen: boolean = false) {
		this.open = open;
		this.recordOpened = open && recordOpen;
	}

	update(patch: Partial<PlayerProfile>) {
		if (!this.profile) {
			return;
		}
		const next = { ...this.profile, ...patch };
		this.profile = next;
		saveProfile(next);
	}
}

export const profileStore = new ProfileStore();
