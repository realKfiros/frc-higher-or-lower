"use client";

import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { profileStore } from "@/stores/profileStore";

const Backdrop = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,.35);
  display: grid;
  place-items: center;
  padding: 16px;
`;

const Modal = styled.div`
  width: 100%;
  max-width: 520px;
  background: white;
  border-radius: 16px;
  border: 1px solid rgba(0,0,0,.12);
  padding: 16px;
`;

const Row = styled.div`
  display: grid;
  gap: 6px;
  margin-top: 10px;
`;

const Label = styled.div`
  font-size: 12px;
  opacity: .75;
  font-weight: 700;
`;

const Input = styled.input`
  border: 1px solid rgba(0,0,0,.14);
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 14px;
`;

const Btn = styled.button`
  border: 1px solid rgba(0,0,0,.14);
  background: white;
  padding: 9px 12px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;

  &:hover { background: rgba(0,0,0,.04); }
`;

export const ProfileModal = observer(function ProfileModal() {
	const {open, recordOpened} = profileStore;

	if (!open) {
		return null;
	}

	const p = profileStore.profile!;
	return (
		<Backdrop onClick={() => profileStore.toggle(false)}>
			<Modal onClick={(e) => e.stopPropagation()}>
				{recordOpened && (
					<div style={{ fontWeight: 800, fontSize: 18, marginBottom: 10 }}>
						Add a name to post this run to the public leaderboard.
					</div>
				)}
				<div style={{ fontWeight: 800, fontSize: 16 }}>Player Profile</div>
				<div style={{ marginTop: 6, fontSize: 13, opacity: .8 }}>
					Used for leaderboard display only - fill a name to be displayed. No password required, and all the fields are optional.
				</div>

				<Row>
					<Label>Name</Label>
					<Input
						value={p.name ?? ""}
						onChange={(e) => profileStore.update({ name: e.target.value })}
						placeholder="e.g. Kfir"
					/>
				</Row>

				<Row>
					<Label>FRC Team #</Label>
					<Input
						inputMode="numeric"
						value={p.favoriteTeam ?? ""}
						onChange={(e) => {
							const v = e.target.value.trim();
							profileStore.update({ favoriteTeam: v ? Number(v) : null });
						}}
						placeholder="e.g. 4744"
					/>
				</Row>

				<Actions>
					<Btn onClick={() => profileStore.toggle(false)}>Done</Btn>
				</Actions>
			</Modal>
		</Backdrop>
	);
});
