"use client";
import type { getOrdersAction } from "@/actions/order";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { OrdersTab } from "./OrdersTab";
import type { ServerErrorType } from "@/hooks/useAction";

export type Props = {
	className?: string;
	completed?: boolean;
	orders: Exclude<Awaited<ReturnType<typeof getOrdersAction>>, ServerErrorType>;
};

export const OrdersTabs = React.memo(function OrderList({
	orders,
	className,
}: Props) {
	return (
		<Tabs className={`${className} w-full text-black`} defaultValue="proc">
			<TabsList className="flex w-full justify-center">
				<TabsTrigger value="proc">Processing</TabsTrigger>
				<TabsTrigger value="comp">Completed</TabsTrigger>
			</TabsList>
			<TabsContent value="proc">
				<OrdersTab orders={orders.processing} />
			</TabsContent>
			<TabsContent value="comp">
				<OrdersTab orders={orders.completed} />
			</TabsContent>
		</Tabs>
	);
});
