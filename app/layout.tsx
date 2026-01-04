import type {Metadata} from "next";
import StyledComponentsRegistry from "@/styles/registry";

export const metadata: Metadata = {
	title: "FRC Banners | Higher or Lower",
	description: "Guess which FRC team has more Blue Banners.",
};

export default function RootLayout({children}: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<StyledComponentsRegistry>{children}</StyledComponentsRegistry>
			</body>
		</html>
	);
}
