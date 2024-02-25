import React from "react"
import { useSearchParams } from "next/navigation"
import { ServerErrorType } from "./useAction"
import { useToastStore } from "@/store/ToastStore"

export function useSearchController<T extends { id: number }>(
	props: SearchProps<T>
) {
	const searchParams = useSearchParams()
	const oldParams = React.useRef(searchParams)
	const isValidResponse = useToastStore((s) => s.isValidResponse)

	React.useEffect(() => {
		async function reloadProducts() {
			props.setLoading?.(true)
			const newItems = await props.query(searchParams, 0, props.page || 20)
			if (!isValidResponse(newItems)) return
			props.setItems(newItems || [])
			props.setLoading?.(false)
		}
		if (searchParams === oldParams.current) return
		oldParams.current = searchParams
		reloadProducts()
	}, [searchParams])
	return searchParams
}
type SearchProps<T extends { id: number }> = {
	query: (
		params: URLSearchParams,
		start: number,
		end: number
	) => Promise<T[] | ServerErrorType>
	setItems: (val: T[]) => void
	setLoading?: (val: boolean) => void
	page?: number
}
