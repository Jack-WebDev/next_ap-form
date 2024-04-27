import type { Metadata } from "next";
import "./globals.css";
import { EdgeStoreProvider } from "../lib/edgestore";

export const metadata: Metadata = {
	title: "Change Request Form",
	icons: {
		icon: "/NSFAS-699x675-1.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="grid justify-items-center">
				<EdgeStoreProvider>{children}</EdgeStoreProvider>
			</body>
		</html>
	);
}
