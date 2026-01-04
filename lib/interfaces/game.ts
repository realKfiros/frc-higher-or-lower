import {TeamSimple} from "@/lib/interfaces/tba";

export type Guess = "higher" | "lower";

export type TeamRound = TeamSimple & { banners: number };
