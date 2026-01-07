import {observer} from "mobx-react-lite";
import {loadingStore} from "@/stores/loadingStore";
import {Spinner} from "@/components/Spinner";
import {ReactNode} from "react";

type LoadingBoundaryProps = {
	children: ReactNode;
}

export const LoadingBoundary = observer(function ({children}: LoadingBoundaryProps) {
	if (loadingStore.loading) {
		return <Spinner />;
	}

	return <>{children}</>;
});
