"use client"
import React from "react"
import useCartStore from "@/store/cartStore"
import { useSession } from "next-auth/react"
import useConfirm from "../../../hooks/modals/useConfirm"
import useModal from "@/hooks/modals/useModal"
import dynamic from "next/dynamic"
import CartIcon from "@public/cart.svg" 
import { getCartAction } from "@/actions/cart"
import { Button } from "@/components/UI/button"
import useToast from "@/hooks/modals/useToast"
import useResponsive from "@/hooks/useWidth"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/UI/drawer"
import { BellElectricIcon } from "lucide-react"
import Loading from "@/components/UI/Loading"

const Cart = dynamic(() => import("../Cart"))
const Login = dynamic(() => import("@/components/modals/Login"))

type Props = {
	className:string
}

type Items = Record<string,number>

function mergeCarts(cart1:Items,cart2:Items){
	const result = structuredClone(cart1)
	const included = Object.keys(result)
	for (const [id,amount] of Object.entries(cart2)){
		if (included.includes(id))
			result[id]=result[id]+amount
		else
			result[id]=amount
	}
	return result
}

export function CartControl(){
	const {error} = useToast()
	const session = useSession()
	const confirm = useConfirm()
	const persist = useCartStore.persist
	const synced = React.useRef(-1)
	const updateCart = useCartStore(state=>state.setItemsAndUpdate)
	React.useEffect(() => {
		async function getCache() {
			if (!persist.hasHydrated()) persist.rehydrate()
			if (session.data?.user?.role !== "user") {
				synced.current=session.data?.user?.id || -1
				return
			}
			if (!persist.hasHydrated) throw "Critical error"
			if (synced.current === session.data.user.id) return
			
			const cart = await getCartAction()
			if ("error" in cart){
				error("Could not sync with database","Connection Error")
				return
			}
			synced.current = session.data.user.id
			const localCart = useCartStore.getState().items
			const haveLocal = Object.keys(localCart).length>0
			const haveRemote = Object.keys(cart).length>0
			if (!haveRemote) return
			if (haveLocal && JSON.stringify(localCart)!==JSON.stringify(cart))
				if ((await confirm("Do you want to keep items from your local cart?")))
					updateCart(mergeCarts(cart,localCart))
				else {
					persist.clearStorage()
					useCartStore.setState({items:cart})
				}
			else useCartStore.setState({items:cart})
		}
			getCache()
	}, [session.data?.user?.id])
	return null
}

export default function CartStatus({className}: Props) {
	const session = useSession()
	const mode = useResponsive()
	const modal = useModal()
	const cart = useCartStore(state => state.items)
	const itemsCount = Object.values(cart).reduce((sum, next) => sum + next, 0)
	const [drawerOpen,setDrawerOpen] = React.useState(false)
	async function cartClickHandler() {
		if (session.data?.user?.role !== "user")
			modal.show(<Loading><Login close={modal.close}/></Loading>)
		else 
			modal.show(<Loading><Cart/></Loading>)
	}
	const content = <>
			<div className="relative  w-wull">
			<CartIcon width="30px" height="30px"/>
		{
			itemsCount
					?
					<div className="
						absolute overflow-hidden 
						-top-4 left-1/2 text-lg
						sm:top-1/2 sm:-translate-y-1/2 sm:-left-6
						w-6 aspect-square rounded-full bg-accent border-tan border-1
					">
					<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
						{itemsCount}
					</span>
					</div>
					:null
				}
			</div>
			Cart
	</>
	return ( mode==="desktop"
		?<Button
			type="button"
				className={`${className} relative bg-transparent hover:bg-transparent justify-center relative flex gap-2 flex-row`}
			onClick={cartClickHandler}
		>
			{content}
		</Button>
		:
				<Drawer  
					onOpenChange={setDrawerOpen}
					open={drawerOpen}
				>
					<DrawerTrigger  onClick={()=>setDrawerOpen(true)} className={`${className} flex relative basis-0 flex-auto flex-col items-center`}>
						{content}
					</DrawerTrigger>
					<DrawerContent 
						onSubmit={()=>setDrawerOpen(false)}
						className="
							grid justify-center content-start w-full pb-14
							border-x-0 h-dvh bg-secondary
					">
					<Loading>
						{session.data?.user ? <Cart/> : <Login/>}
					</Loading>
					</DrawerContent>
				</Drawer>
	)
}
