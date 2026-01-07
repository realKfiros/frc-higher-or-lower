"use client";

import {Header, Page, Title} from "@/styles/page";
import categories from "@/lib/categories";
import styled from "styled-components";
import {useStartGame} from "@/hooks/startGame";
import {observer} from "mobx-react-lite";
import {LoadingBoundary} from "@/components/LoadingBoundary";
import {profileStore} from "@/stores/profileStore";

const SmallBtn = styled.button`
	border: 1px solid rgba(0, 0, 0, .14);
	background: white;
	padding: 9px 12px;
	border-radius: 12px;
	cursor: pointer;
	font-weight: 700;

	&:hover {
		background: rgba(0, 0, 0, .04);
	}
`;

const CategoryButton = styled.div`
	margin: 8px auto;
	padding: 12px 16px;
	border: 1px solid rgba(0, 0, 0, .14);
	border-radius: 12px;
	background: white;
	font-weight: 700;
	cursor: pointer;
	transition: background 0.2s;
	
	&:hover {
		background: rgba(0, 0, 0, .04);
	}
`;

export default observer(function MainPage() {
	const startNewGame = useStartGame();

	return (
		<LoadingBoundary>
			<Page>
				<Header>
					<Title>
						Higher / Lower — Blue Banners
					</Title>
					<SmallBtn onClick={() => profileStore.toggle(true)}>Profile</SmallBtn>
				</Header>
				<p>Create new game:</p>
				{Object.entries(categories).map(([categoryId, category]) => (
					<CategoryButton key={categoryId} onClick={() => startNewGame(categoryId)}>
						{category.title}
					</CategoryButton>
				))}
			</Page>
		</LoadingBoundary>
	);
});
