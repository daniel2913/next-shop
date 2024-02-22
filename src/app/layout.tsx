import "./global.css"
import { ReactElement } from "react"
import RootProviders from "../providers/RootProviders"
import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"
import dynamic from "next/dynamic"
import ToastBase from "@/components/ui/Toast"
import { Metadata, Viewport } from "next"

export const metadata: Metadata = {
	title: "Next shop",
	description: "This is shop and it is in next",
}

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
	colorScheme: "dark light",
}

const ModalBase = dynamic(() => import("@/components/modals/Base"), {
	ssr: false,
})

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
						content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
					/>
					<title>Document</title>
				</head>
				<body
					className={`h-full w-full pr-[var(--removed-body-scroll-bar-size)] `}
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
