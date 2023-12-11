"use client"
import { CompleteOrder } from "@/actions/completeOrder"
import { useRouter } from "next/navigation"
import React from "react"

type Props = {
	action: () => Promise<boolean>
}

export default function Complete({ action }: Props) {
	const router = useRouter()
	const [isPending, startTransition] = React.useTransition()
	function handleClick() {
		startTransition(() => {
			console.log(action)
			const res = action().then((res) => {
				if (res) router.refresh()
			})
		})
	}
	return (
		<button
			onClick={handleClick}
			className="border-1 bg-accent2-400"
		>
			Complete
		</button>
	)
}
