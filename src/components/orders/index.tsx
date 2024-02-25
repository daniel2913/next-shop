"use client"
import { getOrdersAction } from "@/actions/order"
import React from "react"
import useAction from "@/hooks/useAction"
import { ScrollArea } from "@/components/ui/ScrollArea"
import Loading from "@/components/ui/Loading"
import { OrdersTabs } from "./OrdersTabs"

type Props = {
	className?: string
}

export default function OrdersModal(props: Props) {
	const { value: orders, loading } = useAction(getOrdersAction, {
		completed: [],
		processing: [],
	})
	return (
		<div
			className={`flex h-full w-full flex-col items-center  overflow-y-scroll md:h-[70vh] md:w-[60vw] md:overflow-y-auto ${props.className}`}
		>
			<Loading loading={loading}>
				<div className="flex h-full w-full flex-col items-center rounded-md bg-border p-4 pr-1">
					<ScrollArea className="h-full w-full">
						<OrdersTabs
							className="pr-3"
							orders={orders}
						/>
					</ScrollArea>
				</div>
			</Loading>
		</div>
	)
}
