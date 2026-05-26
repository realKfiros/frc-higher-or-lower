export const BEE_CONFETTI_TEAM_NUMBERS = new Set<number>([
	33,
	836,
	3339,
	9449,
	10262,
	10482
]);

export function hasBeeConfettiTeam(teamNumbers: Array<number | undefined>) {
	return teamNumbers.some((teamNumber) => teamNumber !== undefined && BEE_CONFETTI_TEAM_NUMBERS.has(teamNumber));
}
