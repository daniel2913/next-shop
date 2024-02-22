"use client"
import React from "react"
import { Accordion, AccordionContent } from "@/components/ui/Accordion"
import { AccordionItem, AccordionTrigger } from "@comps/ui/Accordion"
import { Props } from "./OrderAdminTabs"
import { PopulatedOrder, completeOrderAction } from "@/actions/order"
import useModal from "@/hooks/modals/useModal"
import useToast from "@/hooks/modals/useToast"
import { useRouter } from "next/navigation"
import { CartTable } from "../../modals/cart/CartTable"
import { Button } from "../../ui/Button"
import GenericSelectTable from "../../ui/GenericSelectTable"

export function OrderTab({ group, props }: OrderTabProps) {
	return (
		<Accordion type="multiple">
			{Object.entries(group).map((group) => (
				<AccordionItem
					value={group[0]}
					key={`user-${group[0]}`}
				>
					<AccordionTrigger>{group[0]}</AccordionTrigger>
					<AccordionContent>
						<OrderTable
							{...props}
							orders={group[1]}
						/>
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	)
}

export type OrderTabProps = {
	group: Record<number, PopulatedOrder[]>
	props: Props
}

function OrderTable(
	props: Omit<Props, "orders"> & { orders: PopulatedOrder[] }
) {
	const router = useRouter()
	const { handleResponse } = useToast()
	const [loading, setLoading] = React.useState(false)
	const { show } = useModal()
	return (
		<GenericSelectTable
			name={props.name}
			columns={{
				Id: (order) => order.id,
				Value: (order) =>
					Object.values(order.order).reduce(
						(sum, order) => sum + order.price * order.amount,
						0
					),
				Details: (order) => (
					<Button
						onClick={() =>
							show(
								<CartTable
									products={order.products}
									order={order.order}
									className="bg-border"
								/>
							)
						}
					>
						Details
					</Button>
				),
				Complete: (order) => (
					<Button
						disabled={loading || order.status !== "PROCESSING"}
						className=""
						onClick={async () => {
							setLoading(true)
							const res = await completeOrderAction(order.id)
							if (handleResponse(res)) router.refresh()
							setLoading(false)
						}}
					>
						Complete
					</Button>
				),
			}}
			items={props.orders.map((order) => ({
				...order.order,
				products: order.products,
			}))}
			value={props.value}
			onChange={props.onChange}
		/>
	)
}
