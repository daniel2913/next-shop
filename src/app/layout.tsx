import "./global.css"
import { ReactElement } from "react"
import RootProviders from "./providers"
import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"
import dynamic from "next/dynamic"
import ToastBase from "@/components/ui/Toast"

export const metadata = {
	title: "Next shop",
	description: "This is shop and it is in next",
}

const ModalBase = dynamic(()=>import("@/components/modals/Base"),{ssr:false})

type LayoutProps = {
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
						content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
					/>
					<title>Document</title>
				</head>
				<body className={`pr-[var(--removed-body-scroll-bar-size)] w-full h-full `}>
					<RootProviders session={session}>
						{children}
						<ModalBase />
						<ToastBase/>
					</RootProviders>
				</body>
			</html>
		</>
	)
}
