import React  from "react"
import Auth from "../UI/Auth"
import CartStatus from "../cart/Status"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import AuthContainer from "../UI/Auth/container"
import Link from "next/link"
import Catalogue from "@public/journal.svg"
import Home from "@public/home.svg"

export default async function NavBar() {
	const session = await getServerSession(authOptions)
	return (
		<>
			<Link href="./" className="order-1 basis-0 flex-auto flex items-center flex-col sm:flex-row">
				<Home width={"30px"} height={"30px"}/>
				Home
			</Link>
			<Link href="./" className="order-1 basis-0 flex-auto items-center flex flex-col sm:flex-row">
				<Catalogue width={"30px"} height={"30px"}/>
				Catalogue
			</Link>
			<CartStatus
				className="flex-auto basis-0 order-3"
			/>
			<AuthContainer className="flex-auto basis-0 order-3">
				<Auth className="" />
			</AuthContainer>
		</>
	)
}
