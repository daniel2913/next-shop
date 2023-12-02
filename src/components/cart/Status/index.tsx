"use client"
import React, { useEffect } from "react"
import useCartStore from "@/store/cartStore"
import { useSession } from "next-auth/react"
import useConfirm from "../../../hooks/modals/useConfirm"
import useModal from "@/hooks/modals/useModal"
import Cart from "../Cart"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"
import { getProducts } from "@/components/Products"

type Props = {
	getProducts: (query:{query:string|string[]|RegExp})=>Promise<PopulatedProduct[]>
}

export default function CartStatus({getProducts}:Props) {
	const items = useCartStore((state) => state.items)
	const { data } = useSession()
	let synced = false
	const modal = useModal()
	const localCache = useCartStore(state => state.items)
	const setLocalCache = useCartStore(state => state.setItems)
	const confirmOverwrite = useConfirm(
		"Do you want to use your local cart cache?",
	)
	useEffect(() => {
		if (!useCartStore.persist.hasHydrated()) useCartStore.persist.rehydrate()
	}, [])
	useEffect(() => {
	async function getCache(){
		if (synced) return false
		if (data?.user?.role === 'user') {
			const remoteCache = await(await fetch("api/store")).json()
			synced = true
			if (Object.keys(remoteCache).length > 0) {
				if (Object.keys(localCache).length===0) {
					setLocalCache(remoteCache)
				} else if (JSON.stringify(remoteCache) !== JSON.stringify(localCache)) {
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

	async function clickHandler(){
		const res = await modal.show(<Cart action={getProducts}close={modal.close}/>)
	}


	return <button
		type = "button"
		onClick={clickHandler}
		>
		{Object.values(localCache).reduce((sum,next)=>sum+next,0)}
	</button>
}
