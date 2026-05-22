import {TeamSimple} from "@/lib/interfaces/tba";
import {tbaGet} from "@/lib/tba";

export async function getTeamDetails(teamNumbers: number[]) {
	const uniqueTeamNumbers = [...new Set(teamNumbers)]
		.filter((teamNumber) => Number.isInteger(teamNumber) && teamNumber > 0)
		.slice(0, 10);

	const teams = await Promise.all(
		uniqueTeamNumbers.map(async (teamNumber) => {
			try {
				const team = await tbaGet<TeamSimple>(`/team/frc${teamNumber}`);
				return [String(teamNumber), team] as const;
			} catch {
				return [String(teamNumber), null] as const;
			}
		}),
	);

	return Object.fromEntries(teams) as Record<string, TeamSimple | null>;
}
