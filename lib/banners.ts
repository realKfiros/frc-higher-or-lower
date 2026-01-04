import { tbaGet } from "./tba";
import { isBlueBannerAward } from "./bannerRules";
import {TbaAward} from "@/lib/interfaces/tba";

type CacheEntry = { value: number; expiresAt: number };

const TTL_MS = 1000 * 60 * 60 * 24 * 7; // שבוע
const cache = new Map<string, CacheEntry>();

export async function getTeamBannerCount(teamKey: string): Promise<number> {
	const now = Date.now();
	const existing = cache.get(teamKey);
	if (existing && existing.expiresAt > now) {
		return existing.value;
	}

	const awards = await tbaGet<TbaAward[]>(`/team/${teamKey}/awards`);
	const banners = awards.reduce(
		(sum, a) => sum + (isBlueBannerAward(a.award_type) ? 1 : 0),
		0
	);

	cache.set(teamKey, { value: banners, expiresAt: now + TTL_MS });
	return banners;
}
