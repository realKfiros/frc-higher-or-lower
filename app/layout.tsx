import {Analytics} from "@vercel/analytics/next"
import type {Metadata} from "next";
import {Roboto} from 'next/font/google';
import StyledComponentsRegistry from "@/styles/registry";

export const metadata: Metadata = {
	title: "FRC Banners | Higher or Lower",
	description: "Guess which FRC team has more Blue Banners.",
};

const roboto = Roboto({
	subsets: ['latin'],
	weight: ['400', '700'],
});

export default function RootLayout({children}: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={roboto.className}>
				<StyledComponentsRegistry>
					{children}
					<Analytics />
				</StyledComponentsRegistry>
			</body>
		</html>
	);
}
