"use client";
import React from "react";
import { Accordion, AccordionContent } from "@/components/ui/Accordion";
import { AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import type { Props } from "./OrderAdminTabs";
import { type PopulatedOrder, completeOrderAction, changeOrderAction } from "@/actions/order";
import { useRouter } from "next/navigation";
import { CartTable } from "@/components/cart/CartTable";
import { Button } from "../../ui/Button";
import GenericSelectTable from "../../ui/GenericSelectTable";
import { ModalContext } from "@/providers/ModalProvider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { error } from "@/components/ui/use-toast";
import { isValidResponse } from "@/helpers/misc";

export function OrderTab({ group, props }: OrderTabProps) {
	return (
		<Accordion type="multiple">
			{Object.entries(group).map((group) => (
				<AccordionItem value={group[0]} key={`user-${group[0]}`}>
					<AccordionTrigger>{group[0]}</AccordionTrigger>
					<AccordionContent>
						<OrderTable {...props} orders={group[1]} />
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
}

export type OrderTabProps = {
	group: Record<number, PopulatedOrder[]>;
	props: Props;
};

function OrderTable(
	props: Omit<Props, "orders"> & { orders: PopulatedOrder[] },
) {
	const router = useRouter();
	const [loading, setLoading] = React.useState(false);
	const show = React.useContext(ModalContext)
	return (
		<GenericSelectTable
			name={props.name}
			columns={{
				Id: (order) => order.id,
				Value: (order) =>
					Object.values(order.order).reduce(
						(sum, order) => sum + order.price * order.amount,
						0,
					).toFixed(2),
				Details: (order) => (
					<Button
						onClick={() =>
							show({
								title: "",
								children: () =>
									<div className="w-[45rem]">
										<CartTable
											products={order.products}
											order={order.order}
											className="bg-border"
										/>
									</div>
							})
						}
					>
						Details
					</Button>
				),
				"Set Status": (order) => (
					<Select
						defaultValue={order.status}
						disabled={loading}
						onValueChange={async (status) => {
							setLoading(true)
							const res = await changeOrderAction(order.id, { status })
							if (!isValidResponse(res)) error(res)
							setLoading(false)
						}}
					>
						<SelectTrigger disabled={loading || order.status === "COMPLETED"} className="w-48" >
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="w-48">
							{["PREPARING", "DELIVERING", "PROCESSING"].map(stat =>
								<SelectItem key={stat} value={stat}>
									{stat}
								</SelectItem>
							)}
						</SelectContent>
					</Select>
				),
				Complete: (order) => (
					<Button
						disabled={loading || order.status === "COMPLETED"}
						className=""
						onClick={async () => {
							setLoading(true);
							const res = await completeOrderAction(order.id);
							if (isValidResponse(res)) router.refresh();
							else error(res)
							setLoading(false);
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
	);
}
