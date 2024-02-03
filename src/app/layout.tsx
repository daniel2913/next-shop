import "./global.css"
import ModalBase from "@/components/modals/Base"
import { ReactElement } from "react"
import RootProviders from "./providers"
import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"
import Toast from "@/components/UI/Toast"
import { ScrollArea, ScrollBar } from "@/components/UI/scroll-area"
import { RemoveScroll } from "react-remove-scroll"

export const metadata = {
	title: "Next shop",
	description: "This is shop and it is in next",
}

interface LayoutProps {
	children: ReactElement
}

export default async function MainLayout({ children }: LayoutProps) {
	const session = await getServerSession(authOptions)
	return (
		<>
			<html className="w-full h-full" lang="en">
				<head>
					<meta charSet="UTF-8" />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1.0"
					/>
					<title>Document</title>
				</head>
				<body className={`pr-[var(--removed-body-scroll-bar-size)] w-full h-full `}>
					<RootProviders session={session}>
						{children}
						<ModalBase />
						<Toast/>
					</RootProviders>
				</body>
			</html>
		</>
	)
}
