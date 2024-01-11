"use client"
import { Button } from "@/components/material-tailwind"
import { useRouter } from "next/navigation"
import React from "react"

type Props = {
	action: () => Promise<boolean>
	className:string
}

export default function Complete({ action, className }: Props) {
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
	<div>
		<Button
			onClick={handleClick}
			className={className}
		>
			Complete
		</Button>
			<span>{error}</span>
	</div>
	)
}
