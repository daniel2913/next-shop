"use client"
import {
	getOrdersAction,
} from "@/actions/order"
import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { OrdersTab } from "./OrdersTab"
import { ServerErrorType } from "@/hooks/useAction"
import { useAuthController } from "@/hooks/useAuthController"
import { useRouter } from "next/navigation"

export type Props = {
	className?: string
	completed?: boolean
	orders: Exclude<Awaited<ReturnType<typeof getOrdersAction>>, ServerErrorType>
}

export const OrdersTabs = React.memo(function OrderList({
	orders,
	className,
}: Props) {
	const router = useRouter()
	useAuthController(()=>router.refresh(),{onUnAuth:()=>router.push("/shop/home")})
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
					orders={orders.processing}
				/>
			</TabsContent>
			<TabsContent value="comp">
				<OrdersTab orders={orders.completed} />
			</TabsContent>
		</Tabs>
	)
})
