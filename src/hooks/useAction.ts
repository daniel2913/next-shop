import { useToastStore } from "@/store/ToastStore"
import React from "react"

export type ServerErrorType = { error: string; title: string }

export default function useAction<T>(
	func: () => Promise<T | ServerErrorType>,
	init: T
) {
	const [value, setValue] = React.useState(init)
	const [loading, setLoading] = React.useState(true)
	const isValidResponse = useToastStore((s) => s.isValidResponse)
	const [_, set] = React.useState(0)
	React.useEffect(() => {
		async function execute() {
			setLoading(true)
			const res = await func()
			setLoading(false)
			if (isValidResponse(res)) setValue(res as T)
		}
		execute()
	}, [_])
	return { value, setValue, loading, reload: () => set((s) => ++s) }
}
