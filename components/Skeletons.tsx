"use client";

import styled, {keyframes} from "styled-components";
import {Page} from "@/styles/page";

const shimmer = keyframes`
	0% { background-position: 120% 0; }
	100% { background-position: -120% 0; }
`;

const Shell = styled.div`
	display: grid;
	gap: 14px;
`;

const Row = styled.div`
	display: flex;
	gap: 10px;
	align-items: center;
	flex-wrap: wrap;
`;

const Block = styled.div<{ $width?: string; $height?: string; $radius?: string }>`
	width: ${({$width}) => $width ?? "100%"};
	height: ${({$height}) => $height ?? "16px"};
	border-radius: ${({$radius}) => $radius ?? "8px"};
	background: linear-gradient(90deg, #eef2f7 25%, #f8fafc 38%, #eef2f7 63%);
	background-size: 240% 100%;
	animation: ${shimmer} 1.4s ease-in-out infinite;
`;

const Hero = styled.div`
	padding: 18px;
	border: 1px solid rgba(24, 32, 44, .10);
	border-radius: 8px;
	background: rgba(255, 255, 255, .72);
	box-shadow: 0 18px 46px rgba(24, 32, 44, .08);
`;

const CardGrid = styled.div`
	display: grid;
	gap: 12px;

	@media (min-width: 760px) {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
`;

const Card = styled.div`
	min-height: 174px;
	padding: 18px;
	border: 1px solid rgba(24, 32, 44, .10);
	border-radius: 8px;
	background: white;
	box-shadow: 0 18px 42px rgba(24, 32, 44, .08);
	display: grid;
	gap: 14px;
	align-content: start;
`;

const WideCard = styled(Card)`
	min-height: 248px;
`;

const Table = styled.div`
	overflow: hidden;
	border: 1px solid rgba(24, 32, 44, .10);
	border-radius: 8px;
	background: white;
	box-shadow: 0 18px 42px rgba(24, 32, 44, .08);
`;

const TableRow = styled.div`
	display: grid;
	grid-template-columns: 44px 1fr 70px;
	gap: 12px;
	padding: 14px;
	border-top: 1px solid rgba(24, 32, 44, .08);

	&:first-child {
		border-top: none;
	}
`;

export function HomeSkeleton() {
	return (
		<Page aria-busy="true" aria-label="Loading game categories">
			<Shell>
				<Row>
					<Block $width="280px" $height="32px" />
					<Block $width="82px" $height="38px" />
				</Row>
				<Hero>
					<Block $width="140px" $height="13px" />
					<div style={{height: 12}} />
					<Block $width="min(520px, 90%)" $height="34px" />
					<div style={{height: 12}} />
					<Block $width="min(620px, 100%)" $height="18px" />
				</Hero>
				<CardGrid>
					{Array.from({length: 6}).map((_, index) => (
						<Card key={index}>
							<Block $width="45%" $height="18px" />
							<Block $width="32%" $height="13px" />
						</Card>
					))}
				</CardGrid>
			</Shell>
		</Page>
	);
}

export function GameSkeleton() {
	return (
		<Page aria-busy="true" aria-label="Loading game">
			<Shell>
				<Block $width="260px" $height="32px" />
				<Row>
					<Block $width="82px" $height="38px" />
					<Block $width="82px" $height="38px" />
					<Block $width="260px" $height="64px" />
				</Row>
				<CardGrid>
					{Array.from({length: 2}).map((_, index) => (
						<WideCard key={index}>
							<Row>
								<Block $width="34px" $height="34px" />
								<Block $width="58px" $height="58px" />
							</Row>
							<Block $width="70%" $height="28px" />
							<Block $width="58%" $height="15px" />
							<Block $width="48%" $height="15px" />
							<Block $height="66px" />
						</WideCard>
					))}
				</CardGrid>
				<Row>
					<Block $width="138px" $height="46px" />
					<Block $width="138px" $height="46px" />
				</Row>
			</Shell>
		</Page>
	);
}

export function LeaderboardSkeleton() {
	return (
		<Page aria-busy="true" aria-label="Loading leaderboard">
			<Shell>
				<Hero>
					<Block $width="120px" $height="13px" />
					<div style={{height: 12}} />
					<Block $width="min(420px, 90%)" $height="34px" />
					<div style={{height: 12}} />
					<Block $width="min(620px, 100%)" $height="18px" />
				</Hero>
				<Row>
					<Block $width="170px" $height="70px" />
					<Block $width="170px" $height="70px" />
				</Row>
				<Table>
					{Array.from({length: 6}).map((_, index) => (
						<TableRow key={index}>
							<Block $width="30px" $height="30px" />
							<Block $width={index === 0 ? "70%" : "52%"} $height="18px" />
							<Block $width="42px" $height="24px" />
						</TableRow>
					))}
				</Table>
			</Shell>
		</Page>
	);
}
