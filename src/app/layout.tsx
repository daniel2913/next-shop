import ModalBase from "@/components/modals/Base";
import { ReactElement } from "react";
import RootProviders from "./providers";
import "./global.css";

export const metadata = {
	title: "Next shop",
	description: "This is shop and it is in next",
};

interface LayoutProps {
	children: ReactElement;
}

export default async function MainLayout({ children }: LayoutProps) {
	return (
		<>
			<html lang="en">
				<head>
					<meta charSet="UTF-8" />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1.0"
					/>
					<title>Document</title>
				</head>
				<body className="w-full overflow-x-hidden">
					<RootProviders>
						{children}
						<ModalBase />
					</RootProviders>
				</body>
			</html>
		</>
	);
}
