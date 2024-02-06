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
import Link from "next/link"

const Cart = dynamic(() => import("../Cart"))
const Login = dynamic(() => import("@/components/modals/Login"))

type Props = {
	className:string
}

type Items = Record<string,number>

function mergeCarts(cart1:Items,cart2:Items){
	console.log("merge")
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
			
			let cart = await getCartAction()
			if ("error" in cart){
				error("Could not sync with database","Connection Error")
				return
			}
			synced.current = session.data.user.id
			const localCart = useCartStore.getState().items
			console.log(localCart,cart)
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
			console.log("end")
		}
			getCache()
	}, [session.data?.user?.id])
	return null
}


export default function CartStatus({className}: Props) {
	const session = useSession()
	const mode = useResponsive()
	const modal = useModal()
	const localCache = useCartStore((state) => state.items)
	const itemsCount = Object.values(localCache).reduce((sum, next) => sum + next, 0)

	async function cartClickHandler() {
		if (Object.values(localCache).length === 0 || session.data?.user?.role !== "user")
			modal.show(<Login close={modal.close}/>)
		else 
			modal.show(<Cart/>)
	}
	const content = <>
			<CartIcon width="30px" height="30px"/>
			Cart
		{
			itemsCount
					?
					<div className="absolute overflow-hidden -top-4 left-1/2 w-6 aspect-square rounded-full bg-accent border-tan border-1">
					<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
						{itemsCount}
					</span>
					</div>
					:null
				}
	</>
	return ( mode==="desktop"
		?<Button
			type="button"
				className={`${className} justify-center relative flex flex-row`}
			onClick={cartClickHandler}
		>
			{content}
		</Button>
		:<Link href="/shop/cart" className={`${className} relative flex flex-col items-center`}>
				{content}
		</Link>
	)
}
