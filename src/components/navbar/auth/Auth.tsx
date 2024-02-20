"use client"
import Exit from "@public/exit.svg"
import { signOut, useSession } from "next-auth/react"
import React from "react"
import { Button } from "@/components/ui/Button"
import { useRouter} from "next/navigation"
import Link from "next/link"
import Admin from "@public/admin.svg"
import  Heart  from "@public/heart.svg"
import OrderMenu from "../Orders"
import useCartStore from "@/store/cartStore"

type Props = {
	className?: string
}

export function ReloadOnUserChange(){
	const router = useRouter()
	const session = useSession()
	React.useEffect(()=>{
		router.refresh()
	}
	,[session])
	return null
}

export default function Auth({ className }: Props) {
	const session = useSession()
	return (
		<div className={`${className} flex flex-col items-center md:flex-row gap-2`}>
			{session.data?.user?.role==="admin"
			?
				<Link className="appearence-none" href={"/admin/products"}>
				<Button 
					className="p-1 flex flex-col h-full"
					type="button"
					variant="link"
					>
					<Admin width="30px" height="30px"/>
					Admin Panel
				</Button>
				</Link>
			: 
			<>
			<OrderMenu className="p-1 flex flex-col gap-0 hover:underline underline-offset-4 h-full"/>
			<Link className="appearence-none w-fit h-fit" href={"/shop/saved"}>
				<Button 
					className="p-1 flex flex-col h-full"
					type="button"
					variant="link"
					>
					<Heart width="30px" height="30px"
						className={`*:stroke-card-foreground *:stroke-1 fill-accent`}
						/>
					Saved
				</Button>
			</Link>
			</>
			}
			<Button
				className="basis-0 hover:bg-transparent text-foreground hover:underline underline-offset-4 bg-transparent p-1 flex flex-col h-full"
				type="submit"
				onClick={async () => {
					await signOut({ redirect: false })
					useCartStore.setState(useCartStore.getInitialState())
				}}
			>
				<Exit className=" *:stroke-accent *:fill-accent" height="30px" width="30px" />
				Sign Out
			</Button>
		</div>
	)
}
