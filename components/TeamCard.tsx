"use client";

import styled from "styled-components";
import {TeamRound} from "@/lib/interfaces/game";

const Card = styled.div`
  border: 1px solid rgba(0,0,0,.12);
  border-radius: 16px;
  padding: 16px;
  background: white;
  min-height: 210px;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: baseline;
`;

const TeamName = styled.div`
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
`;

const TeamNumber = styled.div`
  font-size: 14px;
  opacity: 0.7;
  white-space: nowrap;
`;

const Meta = styled.div`
  margin-top: 10px;
  font-size: 13px;
  opacity: 0.8;
  display: grid;
  gap: 6px;
`;

const BannerValue = styled.div<{ $hidden?: boolean }>`
  margin-top: 14px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(0,0,0,.04);
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;

  ${({ $hidden }) =>
	$hidden
		? `
        filter: blur(10px);
        user-select: none;
      `
		: ""}
`;

function formatLocation(t: TeamRound) {
	const parts = [t.city, t.state_prov, t.country].filter(Boolean);
	return parts.length ? parts.join(", ") : "Unknown location";
}

type TeamCardProps = {
	label: "A" | "B";
	team: TeamRound | null;
	hideBanners?: boolean;
	reveal?: boolean;
};

export default function TeamCard({label, team, hideBanners, reveal}: TeamCardProps) {
	if (!team) {
		return (
			<Card>
				<div style={{ opacity: 0.6 }}>Loading team {label}…</div>
			</Card>
		);
	}

	const displayName = team.nickname || team.name || "Unknown team";

	return (
		<Card>
			<TitleRow>
				<TeamName>{displayName}</TeamName>
				<TeamNumber>#{team.team_number}</TeamNumber>
			</TitleRow>

			<Meta>
				<div>{formatLocation(team)}</div>
				<div>Rookie year: {team.rookie_year ?? "—"}</div>
				<div>Key: {team.key}</div>
			</Meta>

			<BannerValue $hidden={hideBanners && !reveal}>
				{team.banners ?? "—"}
			</BannerValue>
		</Card>
	);
}
