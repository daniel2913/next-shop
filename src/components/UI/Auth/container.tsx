"use client"
import useResponsive from "@/hooks/useWidth"
import { useSession } from "next-auth/react"
import React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../popover"
import Account from "@public/account.svg"
import { Button } from "../button"
import useModal from "@/hooks/modals/useModal"
import Link from "next/link"
import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
const Login = dynamic(() => import("@/components/modals/Login"))

type Props = {
	children: React.ReactNode
	className: string
}

export default function AuthContainer({ children, className }: Props) {
	const mode = useResponsive()
	const modal = useModal()
	const path = usePathname()
	const session = useSession()
	if (!session.data?.user?.name)
		return (
			mode === "desktop"
				?
				<Button
					className={`${className} p-1 flex`}
					variant="secondary"
					type="button"
					onClick={async () => {
						modal.show(<Login close={modal.close} />)
					}}
				>
					<Account width={"30px"} height={"30px"} />
					Log In
				</Button>
				:
				<Link
					className={`${className} flex flex-col items-center`}
					href={`/api/auth/signin?redirect=${path}`}
				>
					<Account width={"30px"} height={"30px"} />
					Log In
				</Link>

		)
	return (
			<Popover>
				<PopoverTrigger className={`${className} flex flex-col items-center`}>
					<Account width={"30px"} height={"30px"} />
					Account
				</PopoverTrigger>
				<PopoverContent
					side={mode === "desktop" ? "bottom" : "top"}
					sideOffset={20}
					className="flex flex-col gap-2 w-full sm:w-fit sm:flex-row"
				>
					{children}
				</PopoverContent>
			</Popover>
	)
}
