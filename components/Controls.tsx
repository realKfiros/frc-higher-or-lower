"use client";

import styled from "styled-components";

type ControlsProps = {
	onHigher: () => void;
	onLower: () => void;
	disabled?: boolean;
};

const Row = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const Button = styled.button<{ $tone: "lower" | "higher" }>`
  min-width: 138px;
  border: 1px solid rgba(24,32,44,.14);
  background: ${({$tone}) => $tone === "higher" ? "#0f766e" : "#334155"};
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 800;
  box-shadow: 0 12px 28px rgba(24,32,44,.16);
  transition: transform .18s, box-shadow .18s, opacity .18s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 16px 34px rgba(24,32,44,.20);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default function Controls({onHigher, onLower, disabled}: ControlsProps) {
	return (
		<Row>
			<Button $tone="lower" onClick={onLower} disabled={disabled}>
				Lower
			</Button>
			<Button $tone="higher" onClick={onHigher} disabled={disabled}>
				Higher
			</Button>
		</Row>
	);
}
