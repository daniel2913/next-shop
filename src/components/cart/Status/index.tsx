"use client"
import React, { ReactElement, useEffect } from "react"
import useCartStore from "@/store/cartStore"
import { useSession } from "next-auth/react"
import useConfirm from "../../../hooks/modals/useConfirm"
import useModal from "@/hooks/modals/useModal"
import dynamic from "next/dynamic"
import { Button } from "@/components/material-tailwind"

const Cart = dynamic(() => import("../Cart"))
import { PopulatedProduct } from "@/lib/DAL/Models/Product"

type Props = {
	getProducts: (query: {
		query: string | string[] | RegExp
	}) => Promise<PopulatedProduct[]>
	orders:ReactElement
}

export default function CartStatus({ getProducts,orders }: Props) {
	const { data } = useSession()
	let synced = React.useRef(-1)
	const modal = useModal()
	const localCache = useCartStore((state) => state.items)
	const setLocalCache = useCartStore((state) => state.setItems)
	const confirmOverwrite = useConfirm(
		"Do you want to use your local cart cache?"
	)
	useEffect(() => {
		if (!useCartStore.persist.hasHydrated()) useCartStore.persist.rehydrate()
	}, [])
	useEffect(() => {
		async function getCache() {
			if (!data?.user?.id) return false
			if (synced.current === data.user.id) {
				return false
			}
			synced.current = data.user.id || -1
			if (data.user.role === "user") {
				const remoteCache = await (await fetch("api/store")).json()
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
		}
		getCache()
	}, [data])

	async function cartClickHandler() {
		if (Object.values(localCache).length === 0 || data?.user?.role !== "user")
			return false
		const res = await modal.show(
			<Cart
				action={getProducts}
				close={modal.close}
			/>
		)
	}
	async function ordersClickHandler() {
		if (data?.user?.role !== "user")
			return false
		const res = await modal.show(orders)
	}

	return (
	<>
		<button
			type="button"
			onClick={cartClickHandler}
		>
			{Object.values(localCache).reduce((sum, next) => sum + next, 0)}
		</button>
		<Button onClick={ordersClickHandler}>TEST</Button>
	</>
	)
}
