export type PlayerProfile = {
	id: string;          // uuid
	name?: string;       // optional
	country?: string;    // optional (ISO/Free text)
	favoriteTeam?: number | null; // team_number
};

const PROFILE_KEY = "frc_hl_profile_v1";
const BEST_KEY = "frc_hl_best_v1";

function safeJsonParse<T>(raw: string | null): T | null {
	if (!raw) return null;
	try {
		return JSON.parse(raw) as T;
	} catch {
		return null;
	}
}

export function getOrCreatePlayerId(): string {
	const existing = safeJsonParse<PlayerProfile>(localStorage.getItem(PROFILE_KEY));
	if (existing?.id) {
		return existing.id;
	}

	const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

	const next: PlayerProfile = {id};
	localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
	return id;
}

export function loadProfile(): PlayerProfile {
	const existing = safeJsonParse<PlayerProfile>(localStorage.getItem(PROFILE_KEY));
	if (existing?.id) {
		return existing;
	}
	return {id: getOrCreatePlayerId()};
}

export function saveProfile(profile: PlayerProfile) {
	localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadBest(): number {
	const raw = localStorage.getItem(BEST_KEY);
	const n = raw ? Number(raw) : 0;
	return Number.isFinite(n) ? n : 0;
}

export function saveBest(best: number) {
	localStorage.setItem(BEST_KEY, String(best));
}
