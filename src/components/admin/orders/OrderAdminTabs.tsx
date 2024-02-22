"use client"

import React from "react"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/Tabs"
import { PopulatedOrder } from "@/actions/order"
import { OrderTab } from "./OrderAdminTab"

export type Props = {
	name?: string
	value: number[]
	orders: {
		completed: PopulatedOrder[]
		processing: PopulatedOrder[]
	}
	onChange: (val: number[]) => void
	config?: boolean
}

const OrdersAdminTabs = React.memo(function OrderList(props: Props) {
	const grouped = React.useMemo(() => {
		const completed: Record<number, PopulatedOrder[]> = {}
		const processing: Record<number, PopulatedOrder[]> = {}
		for (const order of props.orders.processing) {
			if (processing[order.order.user]) processing[order.order.user].push(order)
			else processing[order.order.user] = [order]
		}
		for (const order of props.orders.completed) {
			if (completed[order.order.user]) completed[order.order.user].push(order)
			else completed[order.order.user] = [order]
		}
		return { processing, completed }
	}, [props.orders])
	return (
		<>
			<Tabs defaultValue="processing">
				<TabsList defaultValue="processing">
					<TabsTrigger value="processing">Processing</TabsTrigger>
					<TabsTrigger value="completed">Completed</TabsTrigger>
				</TabsList>
				<TabsContent value="processing">
					<OrderTab
						group={grouped.processing}
						props={props}
					/>
				</TabsContent>
				<TabsContent value="completed">
					<OrderTab
						group={grouped.completed}
						props={props}
					/>
				</TabsContent>
			</Tabs>
		</>
	)
})
export default OrdersAdminTabs
