"use client";

import {TeamColors, TeamRound} from "@/lib/interfaces/game";
import styled from "styled-components";
import TeamCard from "@/components/TeamCard";
import {useEffect, useState} from "react";
import Controls from "@/components/Controls";
import {getOrCreatePlayerId} from "@/lib/localProfile";
import type {PublicRound} from "@/lib/run";
import {PublishResult} from "@/lib/interfaces/run";
import {confettiStore} from "@/stores/confettiStore";
import {ConfettiPreset} from "@/lib/interfaces/confetti_shoot";
import {Stats} from "@/components/Game/Stats";
import {profileStore} from "@/stores/profileStore";
import {TeamSimple} from "@/lib/interfaces/tba";

type GuessProps = {
	a: TeamRound;
	b: TeamRound;
	isGameOver: boolean;
	streak: number;
	maxStreak: number;
	category: string;
	arg?: string;
	runId: string;
	postedToLeaderboard?: boolean;
};

const Grid = styled.div`
	display: grid;
	gap: 12px;
	opacity: 1;
	transition: opacity .2s;

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
	color: #64748b;
	text-align: center;
`;

const Message = styled.div<{ $tone?: "good" | "bad" | "neutral" }>`
	margin-top: 6px;
	padding: 9px 12px;
	border: 1px solid ${({$tone}) => $tone === "bad" ? "rgba(190, 18, 60, .22)" : $tone === "good" ? "rgba(15, 118, 110, .22)" : "rgba(24, 32, 44, .12)"};
	border-radius: 8px;
	background: ${({$tone}) => $tone === "bad" ? "#fff1f2" : $tone === "good" ? "#ecfdf5" : "white"};
	color: ${({$tone}) => $tone === "bad" ? "#be123c" : $tone === "good" ? "#0f766e" : "#334155"};
	font-size: 13px;
	font-weight: 700;
`;

const PostPanel = styled.div`
	margin-top: 2px;
	display: grid;
	gap: 8px;
	justify-items: center;
`;

const PostButton = styled.button`
	border: 0;
	border-radius: 8px;
	background: #0f766e;
	color: white;
	padding: 11px 15px;
	font-weight: 900;
	cursor: pointer;
	box-shadow: 0 14px 30px rgba(15, 118, 110, .20);

	&:disabled {
		opacity: .55;
		cursor: not-allowed;
	}
`;

function withTeamColors(team: TeamRound, colorsByTeam: Record<string, TeamColors | null>) {
	const colors = colorsByTeam[String(team.team_number)];
	if (colors === undefined || team.colors === colors) {
		return team;
	}

	return {
		...team,
		colors,
	};
}

function withTeamLogos(team: TeamRound, logosByTeam: Record<string, string | null>) {
	const logoUrl = logosByTeam[String(team.team_number)];
	if (logoUrl === undefined || team.logoUrl === logoUrl) {
		return team;
	}

	return {
		...team,
		logoUrl,
	};
}

function withTeamDetails(team: TeamRound, detailsByTeam: Record<string, TeamSimple | null>) {
	const details = detailsByTeam[String(team.team_number)];
	if (!details) {
		return team;
	}

	return {
		...team,
		...details,
	};
}

export const Guess = ({a, b, isGameOver, streak, maxStreak, category, arg, runId, postedToLeaderboard}: GuessProps) => {
	const [reveal, setReveal] = useState(isGameOver);
	const [loading, setLoading] = useState(false);
	const [teamA, setTeamA] = useState<TeamRound>(a);
	const [teamB, setTeamB] = useState<TeamRound>(b);
	const [gameOver, setGameOver] = useState(isGameOver);
	const [playerId, setPlayerId] = useState<string>();
	const [currentStreak, setCurrentStreak] = useState(streak);
	const [currentMaxStreak, setCurrentMaxStreak] = useState(maxStreak);
	const [message, setMessage] = useState<string | null>(null);
	const [messageTone, setMessageTone] = useState<"good" | "bad" | "neutral">("neutral");
	const [postLoading, setPostLoading] = useState(false);
	const [posted, setPosted] = useState(!!postedToLeaderboard);

	useEffect(() => {
		setPlayerId(getOrCreatePlayerId());
	}, []);

	useEffect(() => {
		const teamNumbers = [teamA?.team_number, teamB?.team_number]
			.filter((teamNumber): teamNumber is number => !!teamNumber);

		if (!teamNumbers.length) {
			return;
		}

		const controller = new AbortController();
		const params = new URLSearchParams();
		for (const teamNumber of [...new Set(teamNumbers)]) {
			params.append("team", String(teamNumber));
		}

		fetch(`/api/team-colors?${params}`, {signal: controller.signal})
			.then((res) => res.ok ? res.json() : null)
			.then((data: {ok: boolean; teams: Record<string, TeamColors | null>} | null) => {
				if (!data?.ok) {
					return;
				}

				setTeamA((current) => withTeamColors(current, data.teams));
				setTeamB((current) => withTeamColors(current, data.teams));
			})
			.catch(() => undefined);

		return () => controller.abort();
	}, [teamA?.team_number, teamB?.team_number]);

	useEffect(() => {
		const teamNumbers = [teamA?.team_number, teamB?.team_number]
			.filter((teamNumber): teamNumber is number => !!teamNumber);

		if (!teamNumbers.length) {
			return;
		}

		const controller = new AbortController();
		const params = new URLSearchParams();
		for (const teamNumber of [...new Set(teamNumbers)]) {
			params.append("team", String(teamNumber));
		}

		fetch(`/api/team-logos?${params}`, {signal: controller.signal})
			.then((res) => res.ok ? res.json() : null)
			.then((data: {ok: boolean; teams: Record<string, string | null>} | null) => {
				if (!data?.ok) {
					return;
				}

				setTeamA((current) => withTeamLogos(current, data.teams));
				setTeamB((current) => withTeamLogos(current, data.teams));
			})
			.catch(() => undefined);

		return () => controller.abort();
	}, [teamA?.team_number, teamB?.team_number]);

	useEffect(() => {
		const teamNumbers = [teamA?.team_number, teamB?.team_number]
			.filter((teamNumber): teamNumber is number => !!teamNumber);

		if (!teamNumbers.length) {
			return;
		}

		const controller = new AbortController();
		const params = new URLSearchParams();
		for (const teamNumber of [...new Set(teamNumbers)]) {
			params.append("team", String(teamNumber));
		}

		fetch(`/api/team-details?${params}`, {signal: controller.signal})
			.then((res) => res.ok ? res.json() : null)
			.then((data: {ok: boolean; teams: Record<string, TeamSimple | null>} | null) => {
				if (!data?.ok) {
					return;
				}

				setTeamA((current) => withTeamDetails(current, data.teams));
				setTeamB((current) => withTeamDetails(current, data.teams));
			})
			.catch(() => undefined);

		return () => controller.abort();
	}, [teamA?.team_number, teamB?.team_number]);

	const guess = async (dir: "higher" | "lower") => {
		if (loading || gameOver || !playerId) {
			return;
		}
		setLoading(true);
		setMessage("Checking...");
		setMessageTone("neutral");
		const res = await fetch("/api/run/guess", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ runId, playerId, dir }),
		});
		const data = (await res.json()) as
			| { ok: false; error: string }
			| { ok: true; correct: boolean; revealBanners: number; round: PublicRound };

		if (!("ok" in data) || data.ok === false) {
			setLoading(false);
			setMessage(data.error || "That guess could not be scored.");
			setMessageTone("bad");
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
			setMessage(`Game over. Team B had ${data.revealBanners} banners.`);
			setMessageTone("bad");
			return;
		}

		setCurrentStreak(data.round.streak);
		setCurrentMaxStreak(data.round.maxStreak);
		setMessage(`Correct. Team B had ${data.revealBanners} banners.`);
		setMessageTone("good");

		setTimeout(() => {
			// load next round
			setTeamA(data.round.a);
			setTeamB(data.round.b);
			setReveal(false);
			setMessage(null);
		}, 850);
	}

	const postRun = async () => {
		if (!playerId || postLoading || posted) {
			return;
		}

		if (!profileStore.profile?.name?.trim()) {
			setMessage("Add a profile name before posting to the public leaderboard.");
			setMessageTone("neutral");
			profileStore.toggle(true, true);
			return;
		}

		setPostLoading(true);
		const res = await fetch("/api/run/post", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({runId, playerId}),
		});
		const data = (await res.json()) as
			| {ok: false; error: string}
			| {ok: true; record: PublishResult; score: number};
		setPostLoading(false);

		if (!data.ok) {
			setMessage(data.error || "Could not post this run.");
			setMessageTone("bad");
			return;
		}

		if (data.record === "missing-profile") {
			setMessage("Add a profile name before posting to the public leaderboard.");
			setMessageTone("neutral");
			profileStore.toggle(true, true);
			return;
		}

		setPosted(true);
		setMessage(data.record === "already-posted" ? "This run is already posted." : "Posted to the leaderboard.");
		setMessageTone("good");

		if (data.record === "global") {
			confettiStore.shoot({preset: ConfettiPreset.Crossfire, text: "New world record!"});
		} else if (data.record === "personal") {
			confettiStore.shoot({preset: ConfettiPreset.Pride, text: "New personal best!"});
		}
	};

	return <>
		<Stats streak={currentStreak} maxStreak={currentMaxStreak} category={category} arg={arg} />
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
				disabled={!teamA || !teamB || gameOver || loading || !playerId}
				onHigher={() => guess("higher")}
				onLower={() => guess("lower")}
			/>
			{message ? <Message $tone={messageTone}>{message}</Message> : null}

			<Hint>
				Guess whether Team B has <b>more</b> or <b>fewer</b> Blue Banners than Team A.
			</Hint>

			{gameOver ? (
				<PostPanel>
					<Message $tone="bad">Final streak: {currentStreak}</Message>
					<PostButton onClick={postRun} disabled={postLoading || posted || !playerId}>
						{posted ? "Posted to leaderboard" : postLoading ? "Posting..." : "Post to leaderboard"}
					</PostButton>
				</PostPanel>
			) : null}
		</Middle>
	</>;
};
