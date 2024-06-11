"use client";
import { type PopulatedOrder, markOrderSeenAction } from "@/actions/order";
import React from "react";
import { useSession } from "next-auth/react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/Accordion";
import { CartTable } from "../cart/CartTable";

export type OrdersTabProps = {
	orders: PopulatedOrder[];
};

export function OrdersTab({ orders }: OrdersTabProps) {
	const [seen, setSeen] = React.useState<number[]>([]);
	const session = useSession();
	return (
		<Accordion type="single" collapsible>
			{orders.map((order, orderIdx) => (
				<AccordionItem className="mb-2" value={`${orderIdx}`} key={order.order.id}>
					<AccordionTrigger
						onClick={() => {
							if (
								(order.order.seen &&
									order.order.status === "COMPLETED" &&
									!seen.includes(order.order.id)) ||
								session.data?.user?.role !== "user"
							)
								return;
							markOrderSeenAction(order.order.id);
							setSeen((seen) => [...seen, order.order.id]);
						}}
						className="flex text-xl bg-secondary p-2 rounded-lg underline-offset-4"
					>
						{`Order-${order.order.id} - ${order.order.user}`}
						{order.order.seen === false &&
							order.order.status === "COMPLETED" &&
							!seen.includes(order.order.id) &&
							session?.data?.user?.role === "user" ? (
							<div className="ml-auto aspect-square w-2 animate-pulse rounded-full bg-accent" />
						) : null}
					</AccordionTrigger>
					<AccordionContent className="flex-col mt-1 rounded-lg items-center">
						<CartTable
							interactive={false}
							products={order.products}
							order={order.order.order}
						/>
						<div className="w-full justify-end mt-4 flex px-4">
							<div className={`px-2 text-xl rounded-lg  py-1 ${order.order.status === "COMPLETED" ? "bg-green-400" : order.order.status === "DELIVERING" ? "bg-blue-400" : "bg-yellow-400"}`}>
								{order.order.status}
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
}
