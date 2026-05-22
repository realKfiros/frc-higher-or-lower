"use client";

import {Header, Page, Subtitle, Title} from "@/styles/page";
import categories from "@/lib/categories";
import styled from "styled-components";
import {useStartGame} from "@/hooks/startGame";
import {observer} from "mobx-react-lite";
import {LoadingBoundary} from "@/components/LoadingBoundary";
import {profileStore} from "@/stores/profileStore";
import {useEffect, useState} from "react";

const SmallBtn = styled.button`
	border: 1px solid rgba(24, 32, 44, .14);
	background: white;
	padding: 9px 12px;
	border-radius: 8px;
	cursor: pointer;
	font-weight: 700;
	box-shadow: 0 6px 18px rgba(24, 32, 44, .06);

	&:hover {
		background: #f8fafc;
	}
`;

const Hero = styled.section`
	margin: 10px 0 22px;
	padding: 18px;
	border: 1px solid rgba(24, 32, 44, .10);
	border-radius: 8px;
	background: rgba(255, 255, 255, .72);
	box-shadow: 0 18px 50px rgba(24, 32, 44, .08);
`;

const Kicker = styled.div`
	margin-bottom: 8px;
	font-size: 12px;
	font-weight: 800;
	letter-spacing: .08em;
	text-transform: uppercase;
	color: #0f766e;
`;

const Description = styled.p`
	max-width: 640px;
	margin: 10px 0 0;
	color: #4b5563;
	line-height: 1.55;
`;

const CategoryGrid = styled.div`
	display: grid;
	gap: 10px;

	@media (min-width: 680px) {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
`;

const CategoryButton = styled.button`
	width: 100%;
	text-align: left;
	padding: 15px 16px;
	border: 1px solid rgba(24, 32, 44, .12);
	border-radius: 8px;
	background: white;
	cursor: pointer;
	transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
	box-shadow: 0 10px 28px rgba(24, 32, 44, .06);
	
	&:hover {
		transform: translateY(-2px);
		border-color: rgba(15, 118, 110, .36);
		box-shadow: 0 14px 34px rgba(24, 32, 44, .10);
	}
`;

const CategoryTitle = styled.div`
	font-size: 16px;
	font-weight: 800;
`;

const CategoryMeta = styled.div`
	margin-top: 5px;
	font-size: 13px;
	color: #64748b;
`;

export default observer(function MainPage() {
	const [category, setCategory] = useState<string|null>(null);
	const startNewGame = useStartGame();
	const [shownCategories, setShownCategories] = useState<{[key: string]: any}>({});

	useEffect(() => {
		if (category) {
			if (!categories[category].subcategories) {
				startNewGame(category);
			} else {
				setShownCategories(categories[category].subcategories);
			}
		} else {
			setShownCategories(categories);
		}
	}, [category]);

	const onCategoryClick = (categoryId: string) => {
		if (category) {
			startNewGame(category, categoryId);
		} else {
			setCategory(categoryId);
		}
	}

	return (
		<LoadingBoundary>
			<Page>
				<Header>
					<Title>
						Higher / Lower — Blue Banners
					</Title>
					<SmallBtn onClick={() => profileStore.toggle(true)}>Profile</SmallBtn>
				</Header>
				<Hero>
					<Kicker>FRC history quiz</Kicker>
					<Title>Pick the team with more banners.</Title>
					<Description>
						Build a streak by comparing FRC teams across event wins, Impact awards, and regional filters.
					</Description>
				</Hero>
				<Header>
					<Subtitle>
						{category ? categories[category].title : "Create new game:"}
					</Subtitle>
					{category && (
						<SmallBtn onClick={() => setCategory(null)}>Back</SmallBtn>
					)}
				</Header>
				<CategoryGrid>
					{Object.entries(shownCategories).map(([categoryId, category]) => (
						<CategoryButton key={categoryId} onClick={() => onCategoryClick(categoryId)}>
							<CategoryTitle>{category.title || categoryId}</CategoryTitle>
							<CategoryMeta>{category.subcategories ? "Choose a filter" : "Start a new run"}</CategoryMeta>
						</CategoryButton>
					))}
				</CategoryGrid>
			</Page>
		</LoadingBoundary>
	);
});
