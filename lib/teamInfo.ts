import countries from "@/data/countries.json" with {type: "json"};
import participation from "@/data/participation.json" with {type: "json"};
import {TeamSimple} from "@/lib/interfaces/tba";

const countryByTeam = new Map<string, string>();

for (const [country, teams] of Object.entries(countries as Record<string, string[]>)) {
	for (const team of teams) {
		if (!countryByTeam.has(team)) {
			countryByTeam.set(team, country);
		}
	}
}

function getTeamNumber(teamKey: string) {
	return Number(teamKey.replace("frc", ""));
}

export function getTeamSummary(teamKey: string): TeamSimple {
	const years = (participation as Record<string, number[]>)[teamKey] ?? [];
	const teamNumber = getTeamNumber(teamKey);

	return {
		key: teamKey,
		team_number: teamNumber,
		nickname: `Team ${teamNumber}`,
		name: `FRC Team ${teamNumber}`,
		country: countryByTeam.get(teamKey) ?? null,
		rookie_year: years.length ? Math.min(...years) : null,
	};
}
