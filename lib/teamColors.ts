import {TeamColors} from "@/lib/interfaces/game";

type FrcColorsTeamResponse = {
	teamNumber: number;
	colors: TeamColors | null;
};

type FrcColorsBatchResponse = {
	teams: Record<string, FrcColorsTeamResponse>;
};

const FRC_COLORS_BASE = "https://api.frc-colors.com/v1";

export async function getTeamColors(teamNumbers: number[]) {
	const uniqueTeamNumbers = [...new Set(teamNumbers)]
		.filter((teamNumber) => Number.isInteger(teamNumber) && teamNumber > 0)
		.slice(0, 20);

	if (!uniqueTeamNumbers.length) {
		return {};
	}

	const params = new URLSearchParams();
	for (const teamNumber of uniqueTeamNumbers) {
		params.append("team", String(teamNumber));
	}

	const res = await fetch(`${FRC_COLORS_BASE}/team?${params}`, {
		headers: {
			Accept: "application/json",
		},
		next: {
			revalidate: 60 * 60 * 24 * 7,
		},
	});

	if (!res.ok) {
		throw new Error(`FRC Colors ${res.status}`);
	}

	const data = (await res.json()) as FrcColorsBatchResponse;
	const colorsByTeam: Record<string, TeamColors | null> = {};

	for (const [teamNumber, team] of Object.entries(data.teams ?? {})) {
		colorsByTeam[teamNumber] = team.colors;
	}

	return colorsByTeam;
}
