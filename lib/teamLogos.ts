import {tbaGet} from "@/lib/tba";

type TeamMedia = {
	type: string;
	direct_url?: string;
	view_url?: string;
	details?: {
		base64Image?: string;
	};
};

const AVATAR_YEARS = [2026, 2025, 2024, 2023, 2022, 2020, 2019, 2018];

function getAvatarUrl(media: TeamMedia[]) {
	const avatar = media.find((item) => item.type === "avatar");
	if (!avatar) {
		return null;
	}

	if (avatar.details?.base64Image) {
		return `data:image/png;base64,${avatar.details.base64Image}`;
	}

	return avatar.direct_url || avatar.view_url || null;
}

export async function getTeamLogo(teamNumber: number) {
	const teamKey = `frc${teamNumber}`;

	for (const year of AVATAR_YEARS) {
		const media = await tbaGet<TeamMedia[]>(`/team/${teamKey}/media/${year}`, []);
		const logoUrl = getAvatarUrl(media);
		if (logoUrl) {
			return logoUrl;
		}
	}

	return null;
}

export async function getTeamLogos(teamNumbers: number[]) {
	const uniqueTeamNumbers = [...new Set(teamNumbers)]
		.filter((teamNumber) => Number.isInteger(teamNumber) && teamNumber > 0)
		.slice(0, 10);

	const logos = await Promise.all(
		uniqueTeamNumbers.map(async (teamNumber) => {
			try {
				return [String(teamNumber), await getTeamLogo(teamNumber)] as const;
			} catch {
				return [String(teamNumber), null] as const;
			}
		}),
	);

	return Object.fromEntries(logos) as Record<string, string | null>;
}
