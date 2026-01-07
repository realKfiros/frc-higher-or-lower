"use client";

import {profileStore} from "@/stores/profileStore";
import Link from "next/dist/client/link";
import {Header} from "@/styles/page";
import styled from "styled-components";

type StatsProps = {
	streak: number;
	maxStreak: number;
	category: string;
}

const Container = styled.div`
	display: flex;
	gap: 10px;
	font-size: 13px;
	opacity: 0.85;
`;

const SmallBtn = styled.button`
	border: 1px solid rgba(0, 0, 0, .14);
	background: white;
	padding: 9px 12px;
	border-radius: 12px;
	cursor: pointer;
	font-weight: 700;

	&:hover {
		background: rgba(0, 0, 0, .04);
	}
`;

const Badge = styled.span`
	padding: 6px 10px;
	border-radius: 12px;
	border: 1px solid rgba(0, 0, 0, .12);
	background: white;
	font-size: 12px;
	font-weight: 700;
`;

export const Stats = ({streak, maxStreak, category}: StatsProps) => {
	return (
		<Header>
			<Container>
				<Badge>Streak: {streak}</Badge>
				<Badge>Best: {maxStreak}</Badge>
				<Link href={"/leaderboard/" + category}>
					<SmallBtn>Leaderboard</SmallBtn>
				</Link>
			</Container>
		</Header>
	);
}
