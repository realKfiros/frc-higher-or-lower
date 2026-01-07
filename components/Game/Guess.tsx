"use client";

import {TeamRound} from "@/lib/interfaces/game";
import styled from "styled-components";
import TeamCard from "@/components/TeamCard";
import {useEffect, useMemo, useState} from "react";
import Controls from "@/components/Controls";
import {getOrCreatePlayerId} from "@/lib/localProfile";
import type {PublicRound} from "@/lib/run";
import {Spinner} from "@/components/Spinner";
import {RunRecord} from "@/lib/interfaces/run";
import {confettiStore} from "@/stores/confettiStore";
import {ConfettiPreset} from "@/lib/interfaces/confetti_shoot";

type GuessProps = {
	a: TeamRound;
	b: TeamRound;
	isGameOver: boolean;
	streak: number;
	runId: string;
};

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

const GameOver = styled.div`
	margin-top: 6px;
	font-size: 13px;
	font-weight: 700;
`;

export const Guess = ({a, b, isGameOver, streak, runId}: GuessProps) => {
	const [reveal, setReveal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [teamA, setTeamA] = useState<TeamRound>(a);
	const [teamB, setTeamB] = useState<TeamRound>(b);
	const [gameOver, setGameOver] = useState(isGameOver);
	const [playerId, setPlayerId] = useState<string>();

	useEffect(() =>
	{
		setPlayerId(getOrCreatePlayerId);
	}, []);

	const guess = async (dir: "higher" | "lower") => {
		setLoading(true);
		const res = await fetch("/api/run/guess", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ runId: runId, playerId, dir }),
		});
		const data = (await res.json()) as
			| { ok: false; error: string }
			| { ok: true; correct: boolean; revealBanners: number; round: PublicRound; record?: RunRecord };

		if (!("ok" in data) || data.ok === false) {
			setLoading(false);
			return;
		}

		setReveal(true);
		setTeamB({
			...teamB,
			banners: data.revealBanners,
		})
		setLoading(false);

		if (!data.correct) {
			setGameOver(true);
			if (data.record === 'global') {
				confettiStore.shoot({preset: ConfettiPreset.Crossfire, text: 'New world record!'});
			} else if (data.record === 'personal') {
				confettiStore.shoot({preset: ConfettiPreset.Pride, text: 'New personal best!'});
			}
			return;
		}

		setTimeout(() => {
			// load next round
			setTeamA(data.round.a);
			setTeamB(data.round.b);
			setReveal(false);
		}, 850);
	}

	if (loading) {
		return <Spinner />;
	}

	return <>
		<Grid>
			<TeamCard label="A" team={teamA}/>
			<TeamCard
				label="B"
				team={teamB}
				hideBanners
				reveal={reveal}
			/>
		</Grid>
		<Middle>
			<Controls
				disabled={!teamA || !teamB || gameOver}
				onHigher={() => guess("higher")}
				onLower={() => guess("lower")}
			/>

			<Hint>
				Guess whether Team B has <b>more</b> or <b>fewer</b> Blue Banners than Team A.
			</Hint>

			{gameOver ? (
				<GameOver>Game Over — you reached a streak of {streak}.</GameOver>
			) : null}
		</Middle>
	</>;
};
