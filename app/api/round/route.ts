import { NextResponse } from "next/server";
import {getRound} from "@/lib/round";

export async function GET() {
	const round = await getRound();
	return NextResponse.json(round);
}
