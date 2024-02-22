import React from "react"
import { useSearchParams } from "next/navigation"

export default function useInfScroll<T>(
	items: T[],
	loadItems: (
		query: URLSearchParams,
		skip: number,
		page: number
	) => Promise<false | number>,
	endRef: React.RefObject<HTMLDivElement>,
	loading?: boolean,
	page = 20
) {
	const searchParams = useSearchParams()
	const hasMore = React.useRef(true)
	const nextObserver = React.useRef<IntersectionObserver | null>(null)
	React.useEffect(() => {
		hasMore.current = true
		if (loading) return
		nextObserver.current?.disconnect()
		nextObserver.current = new IntersectionObserver(async (entries) => {
			if (!hasMore.current) return false
			if (!entries[0].isIntersecting) return false
			const newItemsAmount = await loadItems(searchParams, items.length, page)
			if (!newItemsAmount || newItemsAmount < page) hasMore.current = false
		})
		nextObserver.current.observe(endRef.current!)
		return () => nextObserver?.current?.disconnect()
	}, [searchParams, page, loadItems, items.length, endRef, loading])
}
