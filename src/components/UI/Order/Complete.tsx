"use client"
import { useRouter } from "next/navigation"
import React from "react"

type Props = {
	action: () => Promise<boolean>
}

export default function Complete({ action }: Props) {
	const router = useRouter()
	const [error, setError] = React.useState("")
	const [isPending, startTransition] = React.useTransition()
	function handleClick() {
		startTransition(() => {
			const res = action().then((res) => { //TODO ERROR MESSAGE
				if (res) router.refresh()
				else setError("Some error ocured!")
			})
		})
	}
	return (
	<>
		<button
			onClick={handleClick}
			className="border-1 bg-accent2-400"
		>
			Complete
		</button>
			<span>{error}</span>
	</>
	)
}
