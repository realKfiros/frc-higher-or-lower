import {flag} from "country-emoji";
import {kv} from "@/lib/kv";
import {PlayerProfile} from "@/lib/localProfile";
import categories from "@/lib/categories";
import {LeaderboardRow} from "@/lib/interfaces/leaderboard";
import {RunRecord} from "@/lib/interfaces/run";

const {getJson, zrevrangeWithScores} = kv;

export const top = async (category: string, countryStr?: string, teamStr?: string, limitStr: string = '50', scanStr: string = '250'): Promise<Array<LeaderboardRow | false>> => {
	const c = categories[category];
	if (!c) {
		return [];
	}

	const country = flag((countryStr || "").trim().toLowerCase());
	const team = teamStr ? Number(teamStr) : null;

	const limit = Math.min(50, Math.max(5, Number(limitStr || 50)));
	const scan = Math.min(400, Math.max(limit, Number(scanStr || 200)));

	const raw = (await zrevrangeWithScores(c.leaderboardKey, 0, scan - 1)).result;

	const pairs: Array<{ playerId: string; score: number }> = [];
	for (let i = 0; i < raw.length; i += 2) {
		pairs.push({ playerId: String(raw[i]), score: Number(raw[i + 1]) });
	}

	const rows = await Promise.all(
		pairs.map(async (p) => {
			const profile = await getJson<PlayerProfile>(`player:${p.playerId}`);
			if (!profile?.name)
				return false;
			return {
				playerId: p.playerId,
				score: p.score,
				name: profile?.name,
				country: profile?.country || "",
				favoriteTeam: profile?.favoriteTeam ?? null,
			};
		})
	);

	const filtered = rows.filter((r) => {
		if (!r) {
			return false;
		}
		if (country && (r.country || "").trim().toLowerCase() !== country) {
			return false;
		}
		return !(team != null && r.favoriteTeam !== team);
	});

	return filtered.slice(0, limit);
};

export const submitRun = async (playerId: string, category: string, score: number): Promise<RunRecord> => {
	const c = categories[category];
	if (!c) {
		throw new Error("Invalid category");
	}

	const currentHighScoreRes = await kv.zscore(c.leaderboardKey, playerId);
	const currentHighScore = currentHighScoreRes.result || 0;
	if (score <= currentHighScore) {
		return 'none';
	}

	await kv.zadd(c.leaderboardKey, score, playerId);

	const personalRank = await kv.zrevrank(c.leaderboardKey, playerId);
	if (personalRank.result === 0) {
		return 'global';
	}

	return 'personal';
}
