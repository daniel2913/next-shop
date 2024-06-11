import "./global.css";
import type { ReactElement } from "react";
import RootProviders from "../providers/RootProviders";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import type { Metadata, Viewport } from "next";
import { getInitState } from "@/actions/user";
import AuthReduxAdapter from "@/helpers/AuthReduxAdapter";

export const metadata: Metadata = {
	title: "Next Shop",
	description: "This is shop and it is written with Next.js",
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
	colorScheme: "dark light",
};

type LayoutProps = {
	children: ReactElement;
};


export default async function MainLayout({ children }: LayoutProps) {
	const [session, state] = await Promise.all([
		getServerSession(authOptions),
		getInitState()
	])

	return (
		<>
			<html className="h-full w-full" lang="en">
				<head>
					<meta charSet="UTF-8" />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1.0, maximum-scale=5.0,"
					/>
					<title>Next Shop</title>
				</head>
				<body
					style={{
						overflowAnchor: "none",
					}}
					className={`w-full pr-[var(--removed-body-scroll-bar-size)] md:h-full `}
				>
					<RootProviders initProps={state} session={session}>
						{children}
						<AuthReduxAdapter />
					</RootProviders>
				</body>
			</html>
		</>
	);
}
