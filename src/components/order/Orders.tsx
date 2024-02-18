"use client"
import { PopulatedOrder, completeOrderAction, getOrdersAction, markOrderSeenAction } from "@/actions/order"
import React from "react"
import useAction, { ServerErrorType } from "@/hooks/useAction"
import { Button } from "@/components/ui/Button"
import { useSession } from "next-auth/react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion"
import { CartTable } from "@/components/cart/Cart"
import useToast from "@/hooks/modals/useToast"
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs"
import Loading from "../ui/Loading"
import Exclamation from "@public/exclaim.svg"

type Props = {
	completed?: boolean
	orders: Exclude<Awaited<ReturnType<typeof getOrdersAction>>, ServerErrorType>
	reload: () => void
}

type PageProps = {
	orders: PopulatedOrder[]
	onComplete?: (order: PopulatedOrder) => void
}

function OrderPage({ orders, onComplete }: PageProps) {
	const [seen,setSeen] = React.useState<number[]>([])
	const session = useSession()
	return (
		<Accordion
			type="single"
			collapsible
		>
			{orders.map((order, orderIdx) =>
				<AccordionItem
					value={`${orderIdx}`}
					key={order.order.id}
				>
					<AccordionTrigger 
						onClick={()=>{
							if (order.order.seen && order.order.status==="COMPLETED" && !seen.includes(order.order.id) || session.data?.user?.role!== "user") return
							markOrderSeenAction(order.order.id)
							setSeen(seen=>[...seen,order.order.id])
						}}
						className="flex">
						{`Order-${order.order.id} - ${order.order.user}`}
						{order.order.seen===false && order.order.status==="COMPLETED" && !seen.includes(order.order.id) && session?.data?.user?.role==="user"
							?	
							<div
								className="ml-auto bg-accent w-4 aspect-square rounded-full"
							/>
							: null
						}
					</AccordionTrigger>
					<AccordionContent
						className="flex justify-center"
					>
						<CartTable interactive={false} products={order.products} order={order.order.order} />
						{session?.data?.user?.role === "admin" && order.order.status === "PROCESSING"
							?
							<Button
								color="cyan"
								className="block ml-auto"
								onClick={() => onComplete?.(order)}
							>
								Complete
							</Button>
							: null
						}
					</AccordionContent>
				</AccordionItem>
			)
			}
		</Accordion>
	)
}


const OrderList = React.memo(function OrderList({ orders, reload }: Props) {

	const { handleResponse } = useToast()
	async function handleComplete(order: PopulatedOrder) {
		if (order.order.status !== "PROCESSING") return
		const res = await completeOrderAction(order.order.id)
		if (handleResponse(res))
			reload()

	}
	return (
		<Tabs className="text-black w-full" defaultValue="proc">
			<TabsList className="w-full flex justify-center">
				<TabsTrigger value="proc">
					Processing
				</TabsTrigger>
				<TabsTrigger value="comp">
					Completed
				</TabsTrigger>
			</TabsList>
			<TabsContent value="proc">
				<OrderPage onComplete={handleComplete} orders={orders.processing} />
			</TabsContent>
			<TabsContent value="comp">
				<OrderPage orders={orders.completed} />
			</TabsContent>
		</Tabs>
	)
})

export default function Orders() {
	const { value: orders, loading, reload } = useAction(getOrdersAction, { completed: [], processing: [] })
	return (
		<div className="md:w-[60vw] w-full h-full md:h-[70vh] flex  md:overflow-y-auto overflow-y-scroll items-center flex-col">
			<Loading loading={loading}>
				<div className="flex flex-col w-full h-full items-center p-4 bg-border rounded-md">
					<ScrollArea className="h-full w-full" type="hover">
						<OrderList orders={orders} reload={reload} />
						<ScrollBar />
					</ScrollArea>
				</div>
			</Loading>
		</div>
	)
}
