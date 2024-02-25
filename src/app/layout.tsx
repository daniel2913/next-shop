import "./global.css"
import { ReactElement } from "react"
import RootProviders from "../providers/RootProviders"
import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"
import ToastBase from "@/components/ui/Toast"
import { Metadata, Viewport } from "next"
import ModalBase from "@/components/modals/Base"

export const metadata: Metadata = {
	title: "Next Shop",
	description: "This is shop and it is written with Next.js",
}

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
	colorScheme: "dark light",
}

type LayoutProps = {
	children: ReactElement
}

export default async function MainLayout({ children }: LayoutProps) {
	const session = await getServerSession(authOptions)
	return (
		<>
			<html
				className="h-full w-full"
				lang="en"
			>
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
					<RootProviders session={session}>
						{children}
						<ModalBase />
						<ToastBase />
					</RootProviders>
				</body>
			</html>
		</>
	)
}
