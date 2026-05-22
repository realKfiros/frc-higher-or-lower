import {observer} from "mobx-react-lite";
import {loadingStore} from "@/stores/loadingStore";
import {ReactNode} from "react";
import {HomeSkeleton} from "@/components/Skeletons";

type LoadingBoundaryProps = {
	children: ReactNode;
}

export const LoadingBoundary = observer(function ({children}: LoadingBoundaryProps) {
	if (loadingStore.loading) {
		return <HomeSkeleton />;
	}

	return <>{children}</>;
});
