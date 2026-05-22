import {Analytics} from "@vercel/analytics/next"
import type {Metadata} from "next";
import StyledComponentsRegistry from "@/styles/registry";
import {Confetti} from "@/components/Confetti";
import {ProfileModal} from "@/components/ProfileModal";
import type {CSSProperties} from "react";

export const metadata: Metadata = {
	title: "FRC Banners | Higher or Lower",
	description: "Guess which FRC team has more Blue Banners.",
};

export default function RootLayout({children}: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body style={bodyStyle}>
				<StyledComponentsRegistry>
					{children}
					<Analytics />
					<Confetti />
					<ProfileModal />
				</StyledComponentsRegistry>
			</body>
		</html>
	);
}

const bodyStyle: CSSProperties = {
	margin: 0,
	background: "linear-gradient(135deg, #f7fafc 0%, #eef2f7 42%, #f6f8fb 100%)",
	fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
};
