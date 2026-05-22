"use client";

import styled from "styled-components";
import {useStartGame} from "@/hooks/startGame";
import {useRouter} from "next/navigation";

type FooterProps = {
	category: string;
	isGameOver: boolean;
};

const Hint = styled.div`
	font-size: 13px;
	opacity: 0.8;
	text-align: center;
`;

const FooterRow = styled.div`
	margin-top: 14px;
	display: flex;
	justify-content: center;
	gap: 10px;
	flex-wrap: wrap;
`;

const SmallBtn = styled.button`
	border: 1px solid rgba(24, 32, 44, .14);
	background: white;
	padding: 9px 12px;
	border-radius: 8px;
	cursor: pointer;
	font-weight: 700;

	&:hover {
		background: rgba(0, 0, 0, .04);
	}
`;

export const Footer = ({category, isGameOver}: FooterProps) => {
	const resetGame = useStartGame();
	const router = useRouter();

	return (
		<FooterRow>
			<SmallBtn onClick={() => resetGame(category)}>
				{isGameOver ? "Restart" : "New run"}
			</SmallBtn>
			<SmallBtn onClick={() => router.push('/')}>
				Select different category
			</SmallBtn>
		</FooterRow>
	)
}
