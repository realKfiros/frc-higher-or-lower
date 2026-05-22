import {getTeamsForCategory} from "@/lib/categories";

type TeamCandidate = {
	key: string;
	banners: number;
};

type RandomTeamOptions = {
	avoidKeys?: string[];
	streak?: number;
};

function pickWeighted(candidates: TeamCandidate[], previousBannerCount: number, streak: number) {
	const difficulty = Math.min(1, Math.max(0, streak / 12));
	const scored = candidates.map((candidate) => {
		const diff = Math.abs(candidate.banners - previousBannerCount);
		const zeroPenalty = candidate.banners === 0 && previousBannerCount !== 0 ? 0.08 : 1;
		const closeScore = previousBannerCount >= 0
			? 1 / Math.max(diff, 1) ** (0.35 + difficulty * 1.25)
			: 1;
		return {
			...candidate,
			weight: Math.max(0.02, closeScore * zeroPenalty),
		};
	});

	const total = scored.reduce((sum, candidate) => sum + candidate.weight, 0);
	let target = Math.random() * total;

	for (const candidate of scored) {
		target -= candidate.weight;
		if (target <= 0) {
			return candidate.key;
		}
	}

	return scored[scored.length - 1].key;
}

function chooseDirection(candidates: TeamCandidate[], previousBannerCount: number) {
	const lower = candidates.filter((team) => team.banners < previousBannerCount);
	const higher = candidates.filter((team) => team.banners > previousBannerCount);

	if (previousBannerCount === 0) {
		return higher;
	}
	if (!higher.length && lower.length) {
		return lower;
	}
	if (!lower.length && higher.length) {
		return higher;
	}
	if (!higher.length && !lower.length) {
		return candidates;
	}

	if (lower.length && lower.every((team) => team.banners === 0) && higher.length) {
		return Math.random() < 0.25 ? lower : higher;
	}

	return Math.random() < 0.5 ? higher : lower;
}

export const getRandomTeamKey = (category: string, previousBannerCount: number = -1, arg?: string, options: RandomTeamOptions = {}): string => {
	const categoryTeams = getTeamsForCategory(category, arg);
	const avoidKeys = new Set(options.avoidKeys ?? []);
	const streak = options.streak ?? 0;
	const allCandidates = Object.entries(categoryTeams)
		.map(([key, banners]) => ({key, banners}));
	let candidates = allCandidates
		.filter((team) => !avoidKeys.has(team.key));

	if (!candidates.length) {
		candidates = allCandidates;
	}

	if (previousBannerCount >= 0) {
		const directionalCandidates = chooseDirection(candidates, previousBannerCount);
		if (directionalCandidates.length) {
			candidates = directionalCandidates;
		} else {
			candidates = chooseDirection(allCandidates, previousBannerCount);
		}
	}

	if (previousBannerCount > 0 && streak >= 3) {
		const boundedTeams = candidates.filter((team) => {
			const diff = Math.abs(team.banners - previousBannerCount);
			const window = Math.max(
				2,
				Math.ceil(previousBannerCount * (0.95 - Math.min(0.65, streak * 0.055))),
			);
			return diff <= window;
		});
		if (boundedTeams.length >= 6) {
			candidates = boundedTeams;
		}
	}

	return pickWeighted(candidates, previousBannerCount, streak);
};
