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
		<Tabs className={`${className} md:w-2/3 px-4 md:px-0  md:mx-auto`} defaultValue="proc">
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
