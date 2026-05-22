import {Header, Page, Title} from "@/styles/page";
import {loadRun} from "@/actions/run";
import categories from "@/lib/categories";
import {Guess} from "@/components/Game/Guess";
import {Footer} from "@/components/Game/Footer";

export const dynamic = "force-dynamic";

type GamePageProps = {
	params: Promise<{runId: string}>,
};

export default async function GamePage({params}: GamePageProps) {
	const {runId} = await params;
	const run = await loadRun(runId);
	if (!run) {
		return <Page>
			<Header>
				<Title>Game not found</Title>
			</Header>
		</Page>;
	}

	const category = categories[run.category];

	return <Page>
		<Header>
			<Title>Game - {category.title} {run.arg && `(${run.arg})`}</Title>
		</Header>
		<Guess {...run} />
		<Footer {...run} />
	</Page>;
}
