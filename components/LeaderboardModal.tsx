"use client";

import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { leaderboardStore } from "@/stores/leaderboardStore";

const Backdrop = styled.div`
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, .35);
	display: grid;
	place-items: center;
	padding: 16px;
`;

const Modal = styled.div`
	width: 100%;
	max-width: 720px;
	background: white;
	border-radius: 16px;
	border: 1px solid rgba(0, 0, 0, .12);
	padding: 16px;
`;

const TopRow = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	gap: 10px;
`;

const BtnRow = styled.div`
	display: flex;
	gap: 10px;
`;

const Btn = styled.button`
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

const Table = styled.div`
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

export default observer(function LeaderboardModal() {
	if (!leaderboardStore.open) return null;

	return (
		<Backdrop onClick={() => leaderboardStore.toggle(false)}>
			<Modal onClick={(e) => e.stopPropagation()}>
				<TopRow>
					<div>
						<div style={{ fontWeight: 800, fontSize: 16 }}>Global Leaderboard</div>
					</div>
				</TopRow>
				<TopRow>
					<BtnRow>
						<Btn onClick={() => leaderboardStore.submitMyBest()}>Submit my best</Btn>
						<Btn onClick={() => leaderboardStore.toggle(false)}>Close</Btn>
					</BtnRow>
				</TopRow>

				<Table>
					<Head>
						<div>#</div>
						<div></div>
						<div>Player</div>
						<div>Score</div>
						<div>Team</div>
					</Head>

					{leaderboardStore.loading ? (
						<Row><div>…</div><div>Loading</div><div>—</div><div>—</div></Row>
					) : (
						leaderboardStore.rows.map((r, idx) => (
							<Row key={r.playerId}>
								<div>{idx + 1}</div>
								<div>{r.country || "—"}</div>
								<div style={{ fontWeight: 700 }}>{r.name || "Anonymous"}</div>
								<div style={{ fontWeight: 800 }}>{r.score}</div>
								<div style={{ opacity: .85 }}>
									{r.favoriteTeam || ""}
								</div>
							</Row>
						))
					)}
				</Table>
			</Modal>
		</Backdrop>
	);
});
