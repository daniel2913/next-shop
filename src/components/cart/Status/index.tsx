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

const Cart = dynamic(() => import("../Cart"))

type Props = {
	getProducts: (query: number | number[]) => Promise<PopulatedProduct[]>
	className:string
}

export default function CartStatus({ getProducts,className}: Props) {
	const session = useSession()
	let synced = React.useRef(-1)
	const modal = useModal()
	const localCache = useCartStore((state) => state.items)
	const persist = useCartStore.persist
	const setLocalCache = useCartStore((state) => state.setItems)
	const confirmOverwrite = useConfirm(
		"Do you want to use your local cart cache?"
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
				if (!remoteCache || typeof remoteCache === "string") return null
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
			return false
		modal.show(
			<Cart/>
		)
	}
	async function ordersClickHandler() {
			}

	return (
	<div className={className}>
		<Button
			type="button"
			onClick={cartClickHandler}
		>
			<CartIcon width="30px" height="30px"/>
			{Object.values(localCache).reduce((sum, next) => sum + next, 0)}
		</Button>
	</div>
	)
}
