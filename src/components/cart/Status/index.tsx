"use client"
import React, { useEffect } from "react"
import useCartStore from "@/store/cartStore"

export default function CartStatus() {
	const items = useCartStore((state) => state.items)
	useEffect(()=>{
	if (!useCartStore.persist.hasHydrated()) useCartStore.persist.rehydrate()
	},[])
	return <div>{items.reduce((sum, i) => sum + i.amount, 0)}</div>
}
