import categories, {BannerTypes} from "@/lib/categories";
import {tbaGet} from "@/lib/tba";
import {CategoryTeams, TeamsLists} from "@/lib/interfaces/category";

type YearsParticipated = {
	[teamKey: string]: number[];
};

type Awards = {
	[teamKey: string]: number[];
};

type Recipient = {
	team_key: string;
};

type EventAwards = {
	award_type: number,
	recipient_list: Recipient[]
};

type EventSimple = {
	key: string;
	event_type: number;
};

enum ExcludedEventTypes {
	OFFSEASON = 99,
	PRESEASON = 100,
	UNLABELED = -1,
}

const makeLists = async () => {
	const yearsParticipated: YearsParticipated = {};
	const awards: Awards = {};

	let year = 1992;
	while (year <= new Date().getFullYear()) {
		console.log(`Processing year ${year}`);
		let yearTeamsPage = 0;
		while (true) {
			const teams = await tbaGet<string[]>(`/teams/${year}/${yearTeamsPage}/keys`, []);
			if (teams.length === 0) {
				break;
			}
			for (const teamKey of teams) {
				if (!yearsParticipated[teamKey]) {
					console.log(teamKey);
					yearsParticipated[teamKey] = [];
				}
				yearsParticipated[teamKey].push(year);
			}
			yearTeamsPage++;
		}
		const yearEvents = await tbaGet<EventSimple[]>(`/events/${year}/simple`, []);
		for (const event of yearEvents) {
			if (Object.values(ExcludedEventTypes).includes(event.event_type)) {
				continue;
			}
			const eventAwards = await tbaGet<EventAwards[]>(`/event/${event.key}/awards`, []);
			for (const award of eventAwards) {
				if (!Object.values(BannerTypes).includes(award.award_type)) {
					continue;
				}
				for (const {team_key} of award.recipient_list) {
					if (!team_key)
						continue;
					if (!awards[team_key]) {
						awards[team_key] = [];
					}
					console.log(`Team ${team_key} won award type ${award.award_type} at event ${event.key}`);
					awards[team_key].push(award.award_type);
				}
			}
		}
		year++;
	}

	await Bun.write('./data/participation_data.json', JSON.stringify(yearsParticipated, null, 4));
	await Bun.write('./data/awards_data.json', JSON.stringify(awards, null, 4));

	console.log('Basic lists generated successfully.');
}

const makeCategoryLists = async () => {
	const awardsFile = Bun.file('./data/awards_data.json');
	const participationFile = Bun.file('./data/participation_data.json');
	const awards: Awards = JSON.parse(await awardsFile.text());
	const yearsParticipated: YearsParticipated = JSON.parse(await participationFile.text());

	const lists: TeamsLists = Object.keys(categories).reduce((obj, category) => ({
		...obj,
		[category]: {} as CategoryTeams,
	}), {});

	for (const [teamKey, years] of Object.entries(yearsParticipated)) {
		console.log(`Processing team ${teamKey}`);
		const yearsParticipatedCount = years.length;
		const teamAwards = awards[teamKey] || [];
		for (const [categoryKey, category] of Object.entries(categories)) {
			const relevantAwards = teamAwards.filter(award => category.bannerTypes.includes(award));
			if (category.filter(relevantAwards.length, yearsParticipatedCount)) {
				console.log(`${teamKey} qualifies for ${categoryKey} category with ${relevantAwards.length} awards`);
				lists[categoryKey][teamKey] = relevantAwards.length;
			}
		}
	}

	await Bun.write('./data/team_lists.json', JSON.stringify(lists, null, 4));

	console.log('Team lists generated successfully.');
}

await makeLists();
await makeCategoryLists();
