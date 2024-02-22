"use client"
import React from "react"
import useCartStore from "@/store/cartStore"
import { useSession } from "next-auth/react"
import { getUserState } from "@/actions/cart"
import useToast from "@/hooks/modals/useToast"
import useConfirm from "@/hooks/modals/useConfirm"
import { mergeCarts } from "./Status"

export function CartControler() {
	const { handleResponse } = useToast()
	const session = useSession()
	const confirm = useConfirm()
	const persist = useCartStore.persist
	const synced = React.useRef(-1)
	const updateCart = useCartStore((state) => state.setItemsAndUpdate)

	React.useEffect(() => {
		async function getCache() {
			if (!persist.hasHydrated()) persist.rehydrate()
			if (session.data?.user?.role !== "user") {
				synced.current = session.data?.user?.id || -1
				return
			}
			if (!persist.hasHydrated) throw "Critical error"
			if (synced.current === session.data.user.id) return

			const state = await getUserState()

			if (!handleResponse(state)) return
			const { cart, saved, votes } = state
			synced.current = session.data.user.id
			const localCart = useCartStore.getState().items
			const haveLocal = Object.keys(localCart).length > 0
			const haveRemote = Object.keys(cart).length > 0
			if (!haveRemote) {
				useCartStore.setState({ saved, votes })
				return
			}
			if (haveLocal && JSON.stringify(localCart) !== JSON.stringify(cart))
				if (await confirm("Do you want to keep items from your local cart?")) {
					const merged = mergeCarts(cart, localCart)
					updateCart(merged)
					useCartStore.setState({ saved, votes, items: merged })
				} else {
					persist.clearStorage()
					useCartStore.setState({ saved, votes, items: cart })
				}
			else useCartStore.setState({ saved, votes, items: cart })
		}
		getCache()
	}, [session.data?.user?.id])
	return null
}
