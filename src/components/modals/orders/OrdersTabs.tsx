"use client"
import {
	PopulatedOrder,
	completeOrderAction,
	getOrdersAction,
} from "@/actions/order"
import React from "react"
import useToast from "@/hooks/modals/useToast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/Tabs"
import { OrdersTab } from "./OrdersTab"
import { ServerErrorType } from "@/hooks/useAction"

export type Props = {
	className?: string
	completed?: boolean
	orders: Exclude<Awaited<ReturnType<typeof getOrdersAction>>, ServerErrorType>
	reload: () => void
}

export const OrdersTabs = React.memo(function OrderList({
	orders,
	className,
	reload,
}: Props) {
	const { handleResponse } = useToast()
	async function handleComplete(order: PopulatedOrder) {
		if (order.order.status !== "PROCESSING") return
		const res = await completeOrderAction(order.order.id)
		if (handleResponse(res)) reload()
	}
	return (
		<Tabs
			className={`${className} w-full text-black`}
			defaultValue="proc"
		>
			<TabsList className="flex w-full justify-center">
				<TabsTrigger value="proc">Processing</TabsTrigger>
				<TabsTrigger value="comp">Completed</TabsTrigger>
			</TabsList>
			<TabsContent value="proc">
				<OrdersTab
					onComplete={handleComplete}
					orders={orders.processing}
				/>
			</TabsContent>
			<TabsContent value="comp">
				<OrdersTab orders={orders.completed} />
			</TabsContent>
		</Tabs>
	)
})
