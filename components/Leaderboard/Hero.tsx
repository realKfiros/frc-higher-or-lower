"use client";

import styled from "styled-components";
import {Title} from "@/styles/page";

const HeroWrap = styled.section`
	margin-bottom: 16px;
	padding: 18px;
	border: 1px solid rgba(15, 118, 110, .14);
	border-radius: 8px;
	background: linear-gradient(135deg, rgba(15, 118, 110, .12), rgba(255,255,255,.88));
	box-shadow: 0 18px 46px rgba(24, 32, 44, .08);
`;

const Eyebrow = styled.div`
	margin-bottom: 8px;
	font-size: 12px;
	font-weight: 900;
	letter-spacing: .08em;
	text-transform: uppercase;
	color: #0f766e;
`;

const Copy = styled.p`
	max-width: 640px;
	margin: 8px 0 0;
	color: #64748b;
	line-height: 1.5;
`;

type LeaderboardHeroProps = {
	title: string;
	arg?: string;
};

export function LeaderboardHero({title, arg}: LeaderboardHeroProps) {
	return (
		<HeroWrap>
			<Eyebrow>Top streaks</Eyebrow>
			<Title>Leaderboard - {title} {arg && `(${arg})`}</Title>
			<Copy>Compare the best runs, search by player name, filter by favorite team, and chase the current high score.</Copy>
		</HeroWrap>
	);
}
