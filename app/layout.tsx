import type { Metadata } from "next";
import "./globals.css";
import { EdgeStoreProvider } from "../lib/edgestore";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
	title: "NSFAS | Change Request Form",
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
			<body className="grid justify-items-center bg-gray-100">
			<ToastContainer autoClose={2000} />

				<EdgeStoreProvider>
					<div className="w-full flex justify-between items-center py-4 px-8 md:px-28">
					<Image src={"/image.webp"} alt="" width={100} height={50} />

					<Image src={"/ndt-technologies-web-logo.svg"} alt="" width={100} height={50} />
					</div>
					{children}
					</EdgeStoreProvider>
			</body>
		</html>
	);
}
