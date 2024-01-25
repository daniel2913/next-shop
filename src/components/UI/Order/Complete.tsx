"use client"
import { Button } from "@/components/material-tailwind"
import useToast from "@/hooks/modals/useToast"
import { useRouter } from "next/navigation"
import React from "react"

type Props = {
	action: (id:number) => Promise<false|string>
	className:string
	id:number
}

export default function Complete({ action, className,id }: Props) {
	const router = useRouter()
	// const {show:showToast} = useToast()
	const [isPending, startTransition] = React.useTransition()
	function handleClick() {
		startTransition(() => {
			const res = action(id).then((res) => {
				if (!res) router.refresh()
				else alert(res)
				// else showToast("Some error ocured!")
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
	</div>
	)
}
