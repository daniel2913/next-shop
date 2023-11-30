"use client"
import React, { useEffect } from "react"
import useCartStore from "@/store/cartStore"
import { useSession } from "next-auth/react"
import useConfirm from "../../../hooks/modals/useConfirm"
export default function CartStatus() {
	const items = useCartStore((state) => state.items)
	const { data } = useSession()
	let synced = false
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
	return <div>{Object.values(localCache).reduce((sum,next)=>sum+next,0)}</div>
}
