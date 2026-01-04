export type TbaAward = {
	name: string;
	year: number;
	event_key: string;
	award_type: number;
};

export type TeamSimple = {
	key: string; // "frc254"
	team_number: number;
	nickname: string | null;
	name: string | null;
	city?: string | null;
	state_prov?: string | null;
	country?: string | null;
	rookie_year?: number | null;
};
