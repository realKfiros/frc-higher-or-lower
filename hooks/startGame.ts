import {useRouter} from "next/navigation";
import {getOrCreatePlayerId} from "@/lib/localProfile";
import {loadingStore} from "@/stores/loadingStore";

export const useStartGame = () => {
	const router = useRouter();

	return async (category: string) => {
		loadingStore.loading = true;
		const res = await fetch("/api/run/create", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				playerId: getOrCreatePlayerId(),
				category,
			}),
		});
		const data = (await res.json()) as { ok: boolean; runId: string };
		if (data.ok) {
			router.push('/game/' + data.runId);
		}
		loadingStore.loading = false;
	}
}
