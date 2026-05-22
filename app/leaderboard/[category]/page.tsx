import categories from "@/lib/categories";
import {Filters} from "@/components/Leaderboard/Filters";
import {Page, Title} from "@/styles/page";
import {top} from "@/actions/leaderboard";
import {Table} from "@/components/Leaderboard/Table";
import {LeaderboardRow} from "@/lib/interfaces/leaderboard";
import {LeaderboardHero} from "@/components/Leaderboard/Hero";

export const dynamic = "force-dynamic";

type LeaderboardPageProps = {
	params: Promise<{category: string, arg?: string}>,
	searchParams: Promise<{name?: string, team?: string, limit?: string, scan?: string, arg?: string}>,
};

export default async function LeaderboardPage({ params, searchParams }: LeaderboardPageProps) {
	const {category} = await params;
	const c = categories[category];

	if (!c) {
		return <Page>
			<Title>Invalid category</Title>
		</Page>;
	}

	const {name, team, limit, scan, arg} = await searchParams;
	const rows = await top(category, name, team, limit, scan, arg);

	return <Page>
		<LeaderboardHero title={c.title} arg={arg} />
		<Filters />
		<Table rows={rows.filter(Boolean) as LeaderboardRow[]} />
	</Page>
};
