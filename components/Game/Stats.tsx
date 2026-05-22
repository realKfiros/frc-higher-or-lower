"use client";

import Link from "next/link";
import styled from "styled-components";

type StatsProps = {
	streak: number;
	maxStreak: number;
	category: string;
	arg?: string;
}

const Container = styled.div`
	margin-bottom: 14px;
	display: grid;
	gap: 12px;

	@media (min-width: 720px) {
		grid-template-columns: 1fr auto;
		align-items: stretch;
	}
`;

const ScorePanel = styled.div`
	display: flex;
	gap: 10px;
	flex-wrap: wrap;
	align-items: center;
`;

const LeaderboardPanel = styled(Link)`
	display: grid;
	gap: 2px;
	min-width: min(100%, 260px);
	border: 1px solid rgba(15, 118, 110, .18);
	border-radius: 8px;
	padding: 12px 14px;
	text-decoration: none;
	color: #18202c;
	background: linear-gradient(135deg, rgba(15, 118, 110, .12), rgba(255, 255, 255, .92));
	box-shadow: 0 14px 32px rgba(15, 118, 110, .12);
	transition: transform .18s, box-shadow .18s;

	&:hover {
		transform: translateY(-1px);
		box-shadow: 0 18px 38px rgba(15, 118, 110, .18);
	}
`;

const LeaderboardTitle = styled.div`
	font-size: 14px;
	font-weight: 900;
`;

const LeaderboardText = styled.div`
	font-size: 12px;
	color: #64748b;
`;

const Badge = styled.span`
	padding: 9px 12px;
	border-radius: 8px;
	border: 1px solid rgba(24, 32, 44, .12);
	background: white;
	font-size: 12px;
	font-weight: 900;
	box-shadow: 0 8px 20px rgba(24, 32, 44, .06);
`;

export const Stats = ({streak, maxStreak, category, arg}: StatsProps) => {
	let href = arg ? `/leaderboard/${category}?arg=${arg}` : `/leaderboard/${category}`;
	return (
		<Container>
			<ScorePanel>
				<Badge>Streak: {streak}</Badge>
				<Badge>Best: {maxStreak}</Badge>
			</ScorePanel>
			<LeaderboardPanel href={href}>
				<LeaderboardTitle>Leaderboard</LeaderboardTitle>
				<LeaderboardText>See the top streaks for this category</LeaderboardText>
			</LeaderboardPanel>
		</Container>
	);
}
