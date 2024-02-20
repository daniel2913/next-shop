import React from "react"
import { useSearchParams } from "next/navigation"
import { PopulatedProduct } from "@/lib/Models/Product"
import useToast from "./modals/useToast"
import { useSession } from "next-auth/react"
import { ServerErrorType } from "./useAction"



type SearchProps<T extends { id: number }> = {
	query: (params: URLSearchParams, start: number, end: number) => Promise<T[] | ServerErrorType>,
	setItems: (val: T[]) => void,
	setLoading?: (val: boolean) => void
	page?: number
}

export function useSearchReload<T extends { id: number }>(props: SearchProps<T>) {

	const searchParams = useSearchParams()
	const oldParams = React.useRef(searchParams)
	const { handleResponse } = useToast()

	React.useEffect(() => {
		async function reloadProducts() {
			props.setLoading?.(true)
			const newItems = await props.query(searchParams, 0, props.page || 20)
			if (!handleResponse(newItems)) return
			props.setItems(newItems || [])
			props.setLoading?.(false)
		}
		if (searchParams === oldParams.current) return
		oldParams.current = searchParams
		reloadProducts()
	}, [searchParams])
	return searchParams
}


type AuthOptions = {
	onUnAuth?:()=>void
}
export function useAuthReload(reload:()=>void,options?:AuthOptions) {
	const session = useSession()
	const oldUser = React.useRef(session?.data?.user?.id)
	React.useEffect(() => {
		if (session.data?.user?.id === oldUser.current) return
		oldUser.current = session.data?.user?.id
		if (session.data?.user?.id || !options?.onUnAuth) reload()
		else options?.onUnAuth?.()
	}, [session.data?.user?.id])
	return session
}

type ItemsProps<T extends { id: number }> = {
	initItems?: T[]
	getItems: (ids: number[]) => Promise<T[] | ServerErrorType>
}

export function useItems<T extends { id: number }>(props: ItemsProps<T>) {
	const { handleResponse } = useToast()
	const [items, setItems] = React.useState(props.initItems || [])
	const [loading, setLoading] = React.useState(false)

	const reload = React.useCallback(async () => {
		setLoading(true)
		const oldIds = items.map(prod => prod.id)
		const newItems = await props.getItems(oldIds)
		if (!handleResponse(newItems)) return
		const newIds = newItems.map(prod => prod.id)
		const persisted = oldIds.filter(id => newIds.includes(id))
		console.log(persisted,newIds)
		setItems(persisted
			.map(prod => newItems
				.find(newProd => newProd.id === prod)!))
		setLoading(false)
	}, [items])

	const reloadOne = React.useCallback(async (id: number) => {
		const newItem = await props.getItems([id])
		if (!handleResponse(newItem)) return
		setItems(products => {
			const idx = products.findIndex(prod => prod.id === id)
			return products.with(idx, newItem[0])
		})
	}, [])

	const updateOne = React.useCallback(async (id: number, part: Partial<PopulatedProduct>) => {
		setItems(items => {
			const idx = items.findIndex(prod => prod.id === id)
			if (idx === -1) return items
			return items.with(idx, { ...items[idx], ...part })
		})
	}, [])

	return { items, loading,setLoading, setItems, reload, reloadOne, updateOne }

}


export default function useInfScroll<T>(
	items: T[],
	loadItems: (query: URLSearchParams, skip: number, page: number) => Promise<false | number>,
	endRef: React.RefObject<HTMLDivElement>,
	loading?:boolean,
	page = 20,
) {
	const searchParams = useSearchParams()
	const hasMore = React.useRef(true)
	const nextObserver = React.useRef<IntersectionObserver | null>(null)
	React.useEffect(() => {
		hasMore.current = true
		nextObserver.current?.disconnect()
		nextObserver.current = new IntersectionObserver(async (entries) => {
			if (!hasMore.current) return false
			if (loading) return false
			console.log(entries[0].isIntersecting)
			if (!entries[0].isIntersecting) return false
			const newItemsAmount = await loadItems(searchParams, items.length, page)
			if (!newItemsAmount || newItemsAmount < page) hasMore.current = false
		})
		return ()=>nextObserver?.current?.disconnect()
	}, [searchParams, page, loadItems, items.length])
	React.useEffect(() => {
		console.log("observe")
		if (endRef.current && nextObserver.current) {
			nextObserver.current.observe(endRef.current)
		}
	}, [endRef, nextObserver.current])
}
