"use client"
import { CompleteOrder } from "@/actions/completeOrder"
import { useRouter } from "next/navigation"
import React from "react"

type Props = {
	id: number
}

export default function Complete({ id }: Props) {
	const router = useRouter()
	const [isPending, startTransition] = React.useTransition()
	function handleClick() {
		startTransition(() => {
			const form = new FormData()
			form.set("id", id.toString())
			CompleteOrder(form).then((res) => {
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
