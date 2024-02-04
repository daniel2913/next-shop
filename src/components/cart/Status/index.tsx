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

const Cart = dynamic(() => import("../Cart"))
const Login = dynamic(() => import("@/components/modals/Login"))

type Props = {
	className:string
}

export default function CartStatus({className}: Props) {
	const session = useSession()
	let synced = React.useRef(-1)
	const reloadProducts = useProductStore(state=>state.reload)
	const modal = useModal()
	const {handleResponse} = useToast()
	const localCache = useCartStore((state) => state.items)
	const persist = useCartStore.persist
	const setLocalCache = useCartStore((state) => state.setItems)
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
