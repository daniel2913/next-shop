"use client"
import useResponsive from "@/hooks/useResponsive"
import { useSession } from "next-auth/react"
import React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@comps/ui/Popover"
import Account from "@public/account.svg"
import { Button } from "@comps/ui/Button"
import useModal from "@/hooks/modals/useModal"
import dynamic from "next/dynamic"
import { Drawer, DrawerContent, DrawerTrigger } from "@comps/ui/Drawer"

const Login = dynamic(() => import("@comps/modals/Login"))

type Props = {
	children: React.ReactNode
	className: string
}

export default function AuthContainer({ children, className }: Props) {
	const mode = useResponsive()
	const modal = useModal()
	const [drawerOpen,setDrawerOpen] = React.useState(false)
	const session = useSession()
	if (!session.data?.user?.name)
		return (
			mode === "desktop"
				?
				<Button
					className={`${className} p-1 flex gap-2`}
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
				<Drawer  
					onOpenChange={setDrawerOpen}
					open={drawerOpen}
					modal={false}
				>
					<DrawerTrigger  onClick={()=>setDrawerOpen(true)} className={`${className} flex basis-0 flex-auto flex-col items-center`}>
					<Account width={"30px"} height={"30px"} />
					Log In
					</DrawerTrigger>
					<DrawerContent 
						onSubmit={()=>setDrawerOpen(false)}
						className="grid justify-center content-start w-full pb-14 border-x-0 h-dvh bg-secondary"
					>
						<Login/>
					</DrawerContent>
				</Drawer>

		)
	return (
			<Popover>
				<PopoverTrigger className={`${className} flex flex-col md:flex-row md:gap-2 items-center`}>
					<Account width={"30px"} height={"30px"} />
					Account
				</PopoverTrigger>
				<PopoverContent
					side={mode === "desktop" ? "bottom" : "top"}
					sideOffset={20}
					className="flex flex-col gap-2 w-full md:w-fit md:flex-row"
				>
					{children}
				</PopoverContent>
			</Popover>
	)
}