import categories from "@/lib/categories";
import {Filters} from "@/components/Leaderboard/Filters";
import {Header, Page, Title} from "@/styles/page";
import {top} from "@/actions/leaderboard";
import {Table} from "@/components/Leaderboard/Table";
import {LeaderboardRow} from "@/lib/interfaces/leaderboard";

type LeaderboardPageProps = {
	params: Promise<{category: string}>,
	searchParams: Promise<{team?: string, country?: string, limit?: string, scan?: string}>,
};

export default async function LeaderboardPage({ params, searchParams }: LeaderboardPageProps) {
	const {category} = await params;
	const c = categories[category];

	if (!c) {
		return <Page>
			<Title>Invalid category</Title>
		</Page>;
	}

	const {country, team, limit, scan} = await searchParams;
	const rows = await top(category, country, team, limit, scan);

	return <Page>
		<Header>
			<Title>Leaderboard - {c.title}</Title>
		</Header>
		<Filters />
		<Table rows={rows.filter(Boolean) as LeaderboardRow[]} />
	</Page>
};
