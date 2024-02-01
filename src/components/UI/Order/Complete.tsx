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
	const {show:showToast} = useToast()
	const [isPending, startTransition] = React.useTransition()
	function handleClick() {
		startTransition(() => {
			const res = action(id).then((res) => {
				if (res) showToast(res)
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
