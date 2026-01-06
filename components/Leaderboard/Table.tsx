"use client";

import styled from "styled-components";
import {LeaderboardRow} from "@/lib/interfaces/leaderboard";

type TableProps = {
	rows: LeaderboardRow[];
};

const Container = styled.div`
	margin-top: 12px;
	border: 1px solid rgba(0, 0, 0, .12);
	border-radius: 12px;
	overflow: hidden;
`;

const Row = styled.div`
	display: grid;
	grid-template-columns: 30px 30px 56px 56px 56px;
	gap: 10px;
	padding: 10px 12px;
	border-top: 1px solid rgba(0, 0, 0, .08);
	font-size: 13px;
	align-items: center;

	&:first-child {
		border-top: none;
	}
`;

const Head = styled(Row)`
	font-weight: 800;
	background: rgba(0, 0, 0, .03);
`;

export const Table = ({rows}: TableProps) => {
	return <Container>
		<Head>
			<div>#</div>
			<div></div>
			<div>Player</div>
			<div>Score</div>
			<div>Team</div>
		</Head>
		{rows.map((r, idx) => (
			<Row key={r.playerId}>
				<div>{idx + 1}</div>
				<div>{r.country || "—"}</div>
				<div style={{ fontWeight: 700 }}>{r.name || "Anonymous"}</div>
				<div style={{ fontWeight: 800 }}>{r.score}</div>
				<div style={{ opacity: .85 }}>
					{r.favoriteTeam || ""}
				</div>
			</Row>
		))}
	</Container>
};
