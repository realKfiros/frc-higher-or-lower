import {TeamSimple} from "@/lib/interfaces/tba";

export type TeamColors = {
	primaryHex: string;
	secondaryHex: string;
	verified: boolean;
};

export type TeamRound = TeamSimple & {
	banners?: number;
	colors?: TeamColors | null;
	logoUrl?: string | null;
};
