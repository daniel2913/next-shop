import React from "react"
import { useSearchParams } from "next/navigation"
import useProductStore from "@/store/productsStore/productStore"

export default function useInfScroll<T extends any>(
	items: T[],
	loadItems: (page: number | undefined, query: URLSearchParams ) => Promise<false | number>,
	endRef: React.RefObject<HTMLDivElement>,
	page: number = 10,
) {
	const searchParams = useSearchParams()
	const hasMore = React.useRef(true)
	const nextObserver = React.useRef<IntersectionObserver | null>(null)
	React.useEffect(()=>{
	hasMore.current = true
	useProductStore.setState({products:[],inited:false})
	nextObserver.current?.disconnect()
	nextObserver.current = new IntersectionObserver(async (entries) => {
		if (!hasMore.current) return false
		if (!entries[0].isIntersecting) return false
		const newItemsAmount = await loadItems(page,searchParams)
			if (!newItemsAmount || newItemsAmount < page) hasMore.current = false
	})
	return nextObserver.current.disconnect()
	},[searchParams])
	React.useEffect(() => {
		if (endRef.current && nextObserver.current) {
			nextObserver.current.observe(endRef.current)
		}
	}, [endRef,nextObserver.current])
	return Object.values(items)
}
