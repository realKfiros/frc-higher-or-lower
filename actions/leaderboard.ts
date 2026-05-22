import {kv} from "@/lib/kv";
import {PlayerProfile} from "@/lib/localProfile";
import categories from "@/lib/categories";
import {LeaderboardRow} from "@/lib/interfaces/leaderboard";
import {RunRecord} from "@/lib/interfaces/run";

const {getJson, zrevrangeWithScores} = kv;

export const top = async (category: string, nameStr?: string, teamStr?: string, limitStr: string = '50', scanStr: string = '250', arg?: string): Promise<Array<LeaderboardRow | false>> => {
	const c = categories[category];
	if (!c) {
		return [];
	}

	const name = (nameStr || "").trim().toLowerCase();
	const team = teamStr ? Number(teamStr) : null;

	const limit = Math.min(50, Math.max(5, Number(limitStr)));
	const scan = Math.min(400, Math.max(limit, Number(scanStr)));

	const raw = (await zrevrangeWithScores(c.leaderboardKey(arg), 0, scan - 1)).result;

	const pairs: Array<{ playerId: string; score: number }> = [];
	for (let i = 0; i < raw.length; i += 2) {
		pairs.push({ playerId: String(raw[i]), score: Number(raw[i + 1]) });
	}

	const rows = await Promise.all(
		pairs.map(async (p) => {
			const profile = await getJson<PlayerProfile>(`player:${p.playerId}`);
			if (!profile?.name) {
				return false;
			}
			return {
				playerId: p.playerId,
				score: p.score,
				name: profile.name,
				favoriteTeam: profile?.favoriteTeam ?? null,
			};
		})
	);

	const filtered = rows.filter((r) => {
		if (!r) {
			return false;
		}
		if (name && !r.name.toLowerCase().includes(name)) {
			return false;
		}
		return !(team != null && r.favoriteTeam !== team);
	});

	return filtered.slice(0, limit);
};

export const submitRun = async (playerId: string, category: string, score: number, arg?: string): Promise<RunRecord> => {
	const c = categories[category];
	if (!c) {
		throw new Error("Invalid category");
	}

	const currentHighScoreRes = await kv.zscore(c.leaderboardKey(arg), playerId);
	const currentHighScore = currentHighScoreRes.result;
	if (currentHighScore != null && score <= currentHighScore) {
		return 'none';
	}

	console.log(`New high score for player ${playerId} in category ${category}: ${score} (old: ${currentHighScore})`);

	await kv.zadd(c.leaderboardKey(arg), score, playerId);

	const personalRank = await kv.zrevrank(c.leaderboardKey(arg), playerId);
	if (personalRank.result === 0) {
		return 'global';
	}

	return 'personal';
}
