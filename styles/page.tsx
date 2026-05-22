"use client";

import styled from "styled-components";

export const Page = styled.main`
	max-width: 1040px;
	margin: 0 auto;
	padding: 28px 16px 44px;
	color: #18202c;
	min-height: 100vh;
`;

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 12px;
	align-items: center;
	margin-bottom: 16px;
	flex-wrap: wrap;
`;

export const Title = styled.h1`
	font-size: 28px;
	line-height: 1.05;
	margin: 0;
`;

export const Subtitle = styled.div`
	font-size: 16px;
	font-weight: 550;
	color: #4b5563;
`;
