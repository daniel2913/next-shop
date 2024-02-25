"use client"
import React from "react"
import useCartStore from "@/store/cartStore"
import useConfirm from "@/hooks/modals/useConfirm"
import { mergeCarts } from "./Status"
import { useAuthController } from "@/hooks/useAuthController"
import { getUserStateAction } from "@/actions/cart"

type Props = {
	cart: Record<string, number>
	saved: number[]
	votes: Record<string, number>
}

export function CartControler(props: Props) {
	const confirm = useConfirm()

	function ResetStore(props: Props) {
		const { cart, saved, votes } = props
		const localCart = useCartStore.getState().items
		const haveLocal = Object.keys(localCart).length > 0
		const haveRemote = Object.keys(cart).length > 0

		if (!haveLocal) {
			useCartStore.setState({ saved, votes, items: cart })
			return
		}
		if (!haveRemote) {
			useCartStore.getState().setItemsAndUpdate(localCart)
			useCartStore.setState({ saved, votes })
			return
		}
		if (JSON.stringify(localCart) === JSON.stringify(cart)) {
			useCartStore.setState({ saved, votes })
			return
		}
		confirm("Do you want to keep items from your local cart?").then((res) => {
			if (res) {
				const merged = mergeCarts(cart, localCart)
				useCartStore.getState().setItemsAndUpdate(merged)
				useCartStore.setState({ saved, votes, items: merged })
			} else {
				useCartStore.persist.clearStorage()
				useCartStore.setState({ saved, votes, items: cart })
			}
		})
	}

	React.useEffect(() => {
		if (!useCartStore.persist.hasHydrated()) useCartStore.persist.rehydrate()
		if (!useCartStore.persist.hasHydrated) throw "Local store error"
		ResetStore(props)
	}, [])

	useAuthController(
		async () => {
			const props = await getUserStateAction()
			ResetStore(props)
		},
		{
			onUnAuth: () => {
				useCartStore.setState({ items: {}, saved: [], votes: {} })
				useCartStore.persist.clearStorage()
			},
		}
	)

	return null
}
