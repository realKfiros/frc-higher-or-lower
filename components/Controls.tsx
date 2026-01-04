"use client";

import styled from "styled-components";

const Row = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  border: 1px solid rgba(0,0,0,.14);
  background: white;
  padding: 10px 14px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;

  &:hover {
    background: rgba(0,0,0,.04);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default function Controls({
									 onHigher,
									 onLower,
									 disabled,
								 }: {
	onHigher: () => void;
	onLower: () => void;
	disabled?: boolean;
}) {
	return (
		<Row>
			<Button onClick={onLower} disabled={disabled}>
				Lower
			</Button>
			<Button onClick={onHigher} disabled={disabled}>
				Higher
			</Button>
		</Row>
	);
}
