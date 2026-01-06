"use client";

import {useEffect} from "react";
import {observer} from "mobx-react-lite";
import styled from "styled-components";
import {gameStore} from "@/stores/gameStore";
import TeamCard from "@/components/TeamCard";
import Controls from "@/components/Controls";
import {profileStore} from "@/stores/profileStore";
import {leaderboardStore} from "@/stores/leaderboardStore";
import ProfileModal from "@/components/ProfileModal";
import LeaderboardModal from "@/components/LeaderboardModal";
import {Confetti} from "@/components/Confetti";
import {Header, Page, Title} from "@/styles/page";
import Link from "next/dist/client/link";

const Stats = styled.div`
	display: flex;
	gap: 10px;
	font-size: 13px;
	opacity: 0.85;
`;

const Grid = styled.div`
	display: grid;
	gap: 12px;

	@media (min-width: 860px) {
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}
`;

const Middle = styled.div`
	margin: 16px 0;
	display: grid;
	gap: 10px;
	justify-items: center;
`;

const Hint = styled.div`
	font-size: 13px;
	opacity: 0.8;
	text-align: center;
`;

const FooterRow = styled.div`
	margin-top: 14px;
	display: flex;
	justify-content: center;
	gap: 10px;
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

const GameOver = styled.div`
	margin-top: 6px;
	font-size: 13px;
	font-weight: 700;
`;

export default observer(function HomePage() {
	useEffect(() => {
		gameStore.start();
	}, []);

	const disabled = gameStore.loading || !gameStore.a || !gameStore.b || gameStore.isGameOver;

	return (
		<Page>
			<Header>
				<Title>Higher / Lower — Blue Banners</Title>
			</Header>
			<Header>
				<Stats>
					<Badge>Streak: {gameStore.streak}</Badge>
					<Badge>Best: {gameStore.best}</Badge>
					<SmallBtn onClick={() => profileStore.toggle(true)}>Profile</SmallBtn>
					<Link href="/leaderboard/regular">
						<SmallBtn>Leaderboard</SmallBtn>
					</Link>
				</Stats>
			</Header>

			<Grid>
				<TeamCard label="A" team={gameStore.a}/>
				<TeamCard
					label="B"
					team={gameStore.b}
					hideBanners
					reveal={gameStore.reveal}
				/>
			</Grid>

			<Middle>
				<Controls
					disabled={disabled}
					onHigher={() => gameStore.guess("higher")}
					onLower={() => gameStore.guess("lower")}
				/>

				<Hint>
					Guess whether Team B has <b>more</b> or <b>fewer</b> Blue Banners than Team A.
				</Hint>

				{gameStore.isGameOver ? (
					<GameOver>Game Over — you reached a streak of {gameStore.streak}.</GameOver>
				) : null}
			</Middle>

			<FooterRow>
				<SmallBtn onClick={() => gameStore.start()}>
					{gameStore.isGameOver ? "Restart" : "New run"}
				</SmallBtn>
			</FooterRow>

			<ProfileModal />
			<LeaderboardModal />
			<Confetti />
		</Page>
	);
});
