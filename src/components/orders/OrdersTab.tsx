"use client"
import { PopulatedOrder, markOrderSeenAction } from "@/actions/order"
import React from "react"
import { useSession } from "next-auth/react"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/Accordion"
import { CartTable } from "../cart/CartTable"

export type OrdersTabProps = {
	orders: PopulatedOrder[]
}

export function OrdersTab({ orders }: OrdersTabProps) {
	const [seen, setSeen] = React.useState<number[]>([])
	const session = useSession()
	return (
		<Accordion
			type="single"
			collapsible
		>
			{orders.map((order, orderIdx) => (
				<AccordionItem
					value={`${orderIdx}`}
					key={order.order.id}
				>
					<AccordionTrigger
						onClick={() => {
							if (
								(order.order.seen &&
									order.order.status === "COMPLETED" &&
									!seen.includes(order.order.id)) ||
								session.data?.user?.role !== "user"
							)
								return
							markOrderSeenAction(order.order.id)
							setSeen((seen) => [...seen, order.order.id])
						}}
						className="flex"
					>
						{`Order-${order.order.id} - ${order.order.user}`}
						{order.order.seen === false &&
						order.order.status === "COMPLETED" &&
						!seen.includes(order.order.id) &&
						session?.data?.user?.role === "user" ? (
							<div className="ml-auto aspect-square w-2 animate-pulse rounded-full bg-accent" />
						) : null}
					</AccordionTrigger>
					<AccordionContent className="flex justify-center">
						<CartTable
							interactive={false}
							products={order.products}
							order={order.order.order}
						/>
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	)
}
