"use client"
import React from "react"
import useCartStore from "@/store/cartStore"
import { useSession } from "next-auth/react"
import useConfirm from "../../../hooks/modals/useConfirm"
import useModal from "@/hooks/modals/useModal"
import dynamic from "next/dynamic"
import CartIcon from "@public/cart.svg" 
import { PopulatedProduct } from "@/lib/DAL/Models/Product"
import { getCartAction } from "@/actions/cart"
import { Button } from "@/components/UI/button"
import Loading from "@/components/UI/Loading"
import useProductStore from "@/store/productsStore/productStore"
import useToast from "@/hooks/modals/useToast"
import useResponsive from "@/hooks/useWidth"
import Link from "next/link"

const Cart = dynamic(() => import("../Cart"))
const Login = dynamic(() => import("@/components/modals/Login"))

type Props = {
	className:string
}

export default function CartStatus({className}: Props) {
	const session = useSession()
	let synced = React.useRef(-1)
	const reloadProducts = useProductStore(state=>state.reload)
	const mode = useResponsive()
	const modal = useModal()
	const {handleResponse} = useToast()
	const localCache = useCartStore((state) => state.items)
	const persist = useCartStore.persist
	const setLocalCache = useCartStore((state) => state.setItems)
	const itemsCount = Object.values(localCache).reduce((sum, next) => sum + next, 0)
	const confirmOverwrite = useConfirm(
		"Your cart already has items in it. Do you want to overwrite it?"
	)
	React.useEffect(() => {
		if (!persist.hasHydrated()) persist.rehydrate()
	}, [])
	React.useEffect(() => {
		async function getCache() {
			const userId = session.data?.user?.id
			if (synced.current === userId) {
				return false
			}
			synced.current = userId || -1
			if (!userId || session.data?.user?.role==="admin") return null
				const remoteCache = await getCartAction()
				if (!handleResponse(remoteCache)) return null
				if (Object.keys(remoteCache).length > 0) {
					if (Object.keys(localCache).length === 0) {
						setLocalCache(remoteCache)
					} else if (
						JSON.stringify(remoteCache) !== JSON.stringify(localCache)
					) {
						confirmOverwrite().then((ans) => {
							if (!ans) {
								setLocalCache(remoteCache)
							}
						})
					}
				}
		}
		if (session.data?.user?.role === "user" && session.data.user.id>0)
		getCache()
	}, [session.data?.user?.id])

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
