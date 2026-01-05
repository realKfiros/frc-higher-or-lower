"use client";

import {observer} from "mobx-react-lite";
import styled from "styled-components";
import {leaderboardStore} from "@/stores/leaderboardStore";

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

const Filters = styled.div`
  margin-top: 12px;
  display: grid;
  gap: 10px;

  @media (min-width: 680px) {
    grid-template-columns: 1fr 1fr auto;
    align-items: end;
  }
`;

const Input = styled.input`
  border: 1px solid rgba(0,0,0,.14);
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
`;

const Label = styled.div`
  font-size: 12px;
  opacity: .75;
  font-weight: 800;
  margin-bottom: 6px;
`;

const MyRow = styled.div`
  margin-top: 12px;
  border: 1px solid rgba(0,0,0,.12);
  border-radius: 12px;
  padding: 10px 12px;
  background: rgba(0,0,0,.03);
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;


export default observer(function LeaderboardModal() {
	if (!leaderboardStore.open) {
		return null;
	}

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
						{/*<Btn onClick={() => leaderboardStore.submitMyRun()}>Submit my run</Btn>*/}
						<Btn onClick={() => leaderboardStore.toggle(false)}>Close</Btn>
					</BtnRow>
				</TopRow>

				<Filters>
					<div>
						<Label>Filter: Country</Label>
						<Input
							value={leaderboardStore.filterCountry}
							onChange={(e) => leaderboardStore.setCountry(e.target.value)}
							placeholder="e.g. Israel"
						/>
					</div>

					<div>
						<Label>Filter: Favorite Team #</Label>
						<Input
							inputMode="numeric"
							value={leaderboardStore.filterTeam}
							onChange={(e) => leaderboardStore.setTeam(e.target.value)}
							placeholder="e.g. 4744"
						/>
					</div>

					<Btn onClick={() => leaderboardStore.refresh()}>Apply</Btn>
				</Filters>

				{leaderboardStore.me ? (
					<MyRow>
						<div style={{ fontWeight: 800 }}>
							My rank: #{leaderboardStore.me.rank} — {leaderboardStore.me.name}
						</div>
						<div style={{ fontWeight: 900 }}>
							Score: {leaderboardStore.me.score}
						</div>
					</MyRow>
				) : (
					<MyRow>
						<div style={{ fontWeight: 800 }}>My rank: —</div>
						<div style={{ opacity: .8 }}>Submit a run to appear</div>
					</MyRow>
				)}

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
