"use client";

import styled from "styled-components";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {leaderboardStore} from "@/stores/leaderboardStore";
import {useDebouncedCallback} from "use-debounce";

const Container = styled.div`
	margin-top: 12px;
	display: grid;
	gap: 10px;

	@media (min-width: 680px) {
		grid-template-columns: 1fr 1fr auto;
		align-items: end;
	}
`;

const Input = styled.input`
	border: 1px solid rgba(0, 0, 0, .14);
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

export const Filters = () => {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const {replace} = useRouter();

	const updateFilter = useDebouncedCallback((key: string, value: string) => {
		const params = new URLSearchParams(searchParams);
		if (value) {
			params.set(key, value);
		} else {
			params.delete(key);
		}
		replace(`${pathname}?${params.toString()}`);
	}, 1000);

	return <Container>
		<div>
			<Label>Filter: Country</Label>
			<Input
				defaultValue={searchParams.get('country')?.toString()}
				onChange={(e) => updateFilter('country', e.target.value)}
				placeholder="e.g. Israel"
			/>
		</div>

		<div>
			<Label>Filter: Favorite Team #</Label>
			<Input
				inputMode="numeric"
				defaultValue={searchParams.get('team')?.toString()}
				onChange={(e) => updateFilter('team', e.target.value)}
				placeholder="e.g. 4744"
			/>
		</div>
	</Container>;
};
