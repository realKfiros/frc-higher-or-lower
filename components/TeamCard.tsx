"use client";

import styled from "styled-components";
import {TeamRound} from "@/lib/interfaces/game";

const Card = styled.div<{ $primary: string; $secondary: string }>`
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(24,32,44,.12);
  border-radius: 8px;
  padding: 18px;
  background:
    linear-gradient(135deg, ${({$primary}) => withAlpha($primary, "22")} 0%, rgba(255,255,255,.94) 30%, ${({$secondary}) => withAlpha($secondary, "2c")} 100%),
    white;
  min-height: 236px;
  box-shadow: 0 18px 42px rgba(24,32,44,.09);

  &::before {
    content: "";
    position: absolute;
    inset: 0 0 auto;
    height: 7px;
    background: linear-gradient(90deg, ${({$primary}) => $primary}, ${({$secondary}) => $secondary});
  }
`;

const Label = styled.div<{ $primary: string; $text: string }>`
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  margin-bottom: 14px;
  border-radius: 8px;
  background: ${({$primary}) => $primary};
  color: ${({$text}) => $text};
  font-size: 14px;
  font-weight: 900;
  box-shadow: 0 10px 22px ${({$primary}) => withAlpha($primary, "33")};
`;

const BrandRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
`;

const LogoImg = styled.img`
  width: 58px;
  height: 58px;
  object-fit: contain;
`;

const TitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: baseline;
`;

const TeamName = styled.div`
  font-size: 22px;
  font-weight: 900;
  line-height: 1.2;
  min-width: 0;
  overflow-wrap: anywhere;
`;

const TeamNumber = styled.div<{ $primary: string; $text: string }>`
  font-size: 22px;
  line-height: 1.2;
  color: ${({$text}) => $text};
  background: ${({$primary}) => withAlpha($primary, "24")};
  border-radius: 8px;
  padding: 2px 8px 3px;
  font-weight: 900;
  white-space: nowrap;
`;

const Meta = styled.div`
  margin-top: 10px;
  font-size: 13px;
  color: #64748b;
  display: grid;
  gap: 6px;
`;

const BannerValue = styled.div<{ $hidden?: boolean; $primary: string; $secondary: string; $text: string }>`
  margin-top: 18px;
  padding: 14px;
  border-radius: 8px;
  background: linear-gradient(135deg, ${({$primary}) => $primary}, ${({$secondary}) => $secondary});
  color: ${({$text}) => $text};
  font-size: 38px;
  font-weight: 900;
  line-height: 1;
  text-align: center;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.24), 0 16px 34px ${({$primary}) => withAlpha($primary, "26")};

  ${({ $hidden }) =>
	$hidden
		? `
        filter: blur(10px);
        user-select: none;
      `
		: ""}
`;

const ColorRail = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 13px;
`;

const Swatch = styled.span<{ $color: string }>`
  width: 28px;
  height: 8px;
  border-radius: 999px;
  background: ${({$color}) => $color};
  border: 1px solid rgba(24,32,44,.14);
`;

function formatLocation(t: TeamRound) {
	const parts = [t.city, t.state_prov, t.country].filter(Boolean);
	return parts.length ? parts.join(", ") : "Unknown location";
}

function isHexColor(value?: string) {
	return /^#[0-9a-f]{6}$/i.test(value ?? "");
}

function withAlpha(hex: string, alpha: string) {
	return isHexColor(hex) ? `${hex}${alpha}` : hex;
}

function getTextColor(background: string) {
	if (!isHexColor(background)) {
		return "#ffffff";
	}

	const red = Number.parseInt(background.slice(1, 3), 16);
	const green = Number.parseInt(background.slice(3, 5), 16);
	const blue = Number.parseInt(background.slice(5, 7), 16);
	const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

	return luminance > 0.58 ? "#18202c" : "#ffffff";
}

function getLuminance(hex: string) {
	if (!isHexColor(hex)) {
		return 0;
	}

	const red = Number.parseInt(hex.slice(1, 3), 16);
	const green = Number.parseInt(hex.slice(3, 5), 16);
	const blue = Number.parseInt(hex.slice(5, 7), 16);

	return (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
}

function getDarkerColor(first: string, second: string) {
	if (!isHexColor(first) && !isHexColor(second)) {
		return "#18202c";
	}
	if (!isHexColor(first)) {
		return second;
	}
	if (!isHexColor(second)) {
		return first;
	}

	return getLuminance(first) <= getLuminance(second) ? first : second;
}

type TeamCardProps = {
	label: "A" | "B";
	team?: TeamRound;
	hideBanners?: boolean;
	reveal?: boolean;
};

export default function TeamCard({label, team, hideBanners = false, reveal}: TeamCardProps) {
	if (!team) {
		return (
			<Card $primary="#0f766e" $secondary="#e6fffb">
				<div style={{ opacity: 0.6 }}>Loading team {label}…</div>
			</Card>
		);
	}

	const displayName = team.nickname || team.name || "Unknown team";
	const primary = isHexColor(team.colors?.primaryHex) ? team.colors!.primaryHex : "#0f766e";
	const secondary = isHexColor(team.colors?.secondaryHex) ? team.colors!.secondaryHex : "#dbeafe";
	const textColor = getTextColor(primary);
	const numberColor = getDarkerColor(primary, secondary);

	return (
		<Card $primary={primary} $secondary={secondary}>
			<BrandRow>
				<Label $primary={primary} $text={textColor}>{label}</Label>
				{team.logoUrl ? (
					<LogoImg src={team.logoUrl} alt={`${displayName} logo`} />
				) : null}
			</BrandRow>
			<TitleRow>
				<TeamName>{displayName}</TeamName>
				<TeamNumber $primary={primary} $text={numberColor}>#{team.team_number}</TeamNumber>
			</TitleRow>

			<Meta>
				<div>{formatLocation(team)}</div>
				<div>Rookie year: {team.rookie_year ?? "—"}</div>
			</Meta>

			<ColorRail aria-hidden>
				<Swatch $color={primary} />
				<Swatch $color={secondary} />
			</ColorRail>

			<BannerValue $primary={primary} $secondary={secondary} $text={textColor} $hidden={hideBanners && !reveal}>
				{team.banners ?? "—"}
			</BannerValue>
		</Card>
	);
}
