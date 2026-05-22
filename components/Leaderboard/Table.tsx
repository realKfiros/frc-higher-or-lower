"use client";

import styled from "styled-components";
import {LeaderboardRow} from "@/lib/interfaces/leaderboard";

type TableProps = {
	rows: LeaderboardRow[];
};

const Container = styled.div`
	margin-top: 14px;
	border: 1px solid rgba(24, 32, 44, .10);
	border-radius: 8px;
	overflow: hidden;
	background: white;
	box-shadow: 0 18px 42px rgba(24, 32, 44, .08);
`;

const Row = styled.div`
	display: grid;
	grid-template-columns: 44px minmax(0, 1fr) 70px 80px;
	gap: 12px;
	padding: 12px 14px;
	border-top: 1px solid rgba(24, 32, 44, .08);
	font-size: 14px;
	align-items: center;

	&:first-child {
		border-top: none;
	}

	@media (max-width: 560px) {
		grid-template-columns: 36px minmax(0, 1fr) 64px;

		& > :nth-child(4) {
			display: none;
		}
	}
`;

const Head = styled(Row)`
	font-size: 12px;
	font-weight: 900;
	color: #64748b;
	text-transform: uppercase;
	background: #f8fafc;
`;

const Rank = styled.div<{ $top?: boolean }>`
	display: inline-grid;
	place-items: center;
	width: 30px;
	height: 30px;
	border-radius: 8px;
	font-weight: 900;
	color: ${({$top}) => $top ? "#0f766e" : "#334155"};
	background: ${({$top}) => $top ? "rgba(15, 118, 110, .12)" : "#f1f5f9"};
`;

const Name = styled.div`
	min-width: 0;
	font-weight: 900;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const Score = styled.div`
	font-size: 18px;
	font-weight: 900;
	color: #0f766e;
`;

const Empty = styled.div`
	padding: 22px 16px;
	text-align: center;
	color: #64748b;
	font-weight: 700;
`;

const Player = styled.div`
	display: grid;
	gap: 2px;
	min-width: 0;
`;

const PlayerHint = styled.div`
	font-size: 12px;
	color: #94a3b8;
`;

export const Table = ({rows}: TableProps) => {
	return <Container>
		<Head>
			<div>#</div>
			<div>Player</div>
			<div>Score</div>
			<div>Team</div>
		</Head>
		{rows.length === 0 ? (
			<Empty>No leaderboard entries yet.</Empty>
		) : null}
		{rows.map((r, idx) => (
			<Row key={r.playerId}>
				<Rank $top={idx < 3}>{idx + 1}</Rank>
				<Player>
					<Name>{r.name || "Anonymous"}</Name>
					{!r.favoriteTeam ? <PlayerHint>Add favorite team to profile</PlayerHint> : null}
				</Player>
				<Score>{r.score}</Score>
				<div style={{ opacity: .85 }}>
					{r.favoriteTeam || ""}
				</div>
			</Row>
		))}
	</Container>
};
