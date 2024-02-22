"use client"
import useResponsive from "@/hooks/useResponsive"
import { useSession } from "next-auth/react"
import React from "react"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/Popover"
import Account from "@public/account.svg"
import useModal from "@/hooks/modals/useModal"
import dynamic from "next/dynamic"
import NavButton from "../../ui/Navbutton"

const Login = dynamic(() => import("@/components/modals/auth/index"))

type Props = {
	children: React.ReactNode
	className: string
}

export default function AuthContainer({ children, className }: Props) {
	const mode = useResponsive()
	const modal = useModal()
	const session = useSession()
	if (!session.data?.user?.name)
		return (
			<NavButton
				onClick={() => modal.show(<Login close={modal.close} />)}
				className={className}
			>
				<Account
					className="*:stroke-foreground *:stroke-2"
					width={"30px"}
					height={"30px"}
				/>
				Log In
			</NavButton>
		)
	return (
		<Popover>
			<PopoverTrigger asChild={true}>
				<NavButton className={className}>
					<Account
						className="*:stroke-foreground *:stroke-2"
						width={"30px"}
						height={"30px"}
					/>
					Account
				</NavButton>
			</PopoverTrigger>
			<PopoverContent
				side={mode === "desktop" ? "bottom" : "top"}
				sideOffset={20}
				className="flex w-full flex-col gap-2 md:w-fit md:flex-row"
			>
				{children}
			</PopoverContent>
		</Popover>
	)
}
