"use client"
import { completeOrder, getOrdersAction } from "@/actions/order"
import React  from "react"
import useAction, { ServerErrorType } from "@/hooks/useAction"
import {Button} from "@/components/UI/button"
import { Switch } from "@/components/UI/switch"
import { useSession } from "next-auth/react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/UI/accordion"
import { CartTable } from "../Cart"
import useToast from "@/hooks/modals/useToast"
import { ScrollArea, ScrollBar } from "@/components/UI/scroll-area"
import Reload from "@public/reload.svg" 

type Props = {
	completed?:boolean
	orders: Exclude<Awaited<ReturnType<typeof getOrdersAction>>,ServerErrorType>
	setOrders:(val:Props["orders"])=>void
}
const OrderList = React.memo(function OrderList({completed,orders,setOrders}:Props){
	const session = useSession()
	const {handleResponse} = useToast()
	return(<>
		<Accordion 
			type="single"
			collapsible
		>
		{(completed ? orders?.completed||[] : orders?.processing||[])
				.map((order,orderIdx) => {
			const data = {
				user: +order.order.user,
				id: +order.order.id,
				prodIds: Object.keys(order.order.order).map(Number),
			}
			return (
				<AccordionItem
					value={`${orderIdx}`}
					key={order.order.id}
				>
				<AccordionTrigger>
					{`Order-${order.order.id} - ${order.order.user}`}
				</AccordionTrigger>
				<AccordionContent
					className="flex justify-center"
					>
					<CartTable products={order.products} order={order.order.order}/>
					{session?.data?.user?.role === "admin" && order.order.status === "PROCESSING"
							?
								<Button
									color="cyan"
									className="block ml-auto"
									onClick={async ()=>{
											const res = await completeOrder(data.id)
											if (handleResponse(res))
												setOrders({
												completed:[...orders!.completed,orders!.processing.find(o=>o?.order.id===order.order.id)!],
												processing:orders?.processing.filter(o=>o.order?.id!==order.order.id)!
												})
										return res
									}}
								>
									Complete
								</Button>
							: null
					}
				</AccordionContent>
				</AccordionItem>
			)
		}
		)}
		</Accordion>
	</>)
})

export default function Orders() {
	const [completed, setCompleted] = React.useState(false)
	const {value:orders,loading,setValue:setOrders,reload} = useAction(getOrdersAction,{completed:[],processing:[]})
	const completedDef = React.useDeferredValue(completed)
	return (
		<div className=" flex flex-col h-dvh w-dvw sm:h-[70vh] sm:w-[60vw]">
			<div className="ml-auto w-fit flex-grow-0 items-center flex gap-4">
			<Button className={`
					bg-transparent hover:bg-transparent
					${loading ? "animate-spin" : ""}
				`} 
				onClick={()=>reload()}><Reload width="30px" height="30px"/></Button>
				<label
					htmlFor="completed"
					className={`flex flex-col items-center font-semibold transition-colors ${completed ? "text-brown-800" :"text-blue-gray-500"}`}
				>
					COMPLETED
				<Switch
					id="completed"
					checked={completed}
					onCheckedChange={setCompleted}
				/>
				</label>
			</div>
			<ScrollArea className="h-full w-full" type="always">
			<React.Suspense fallback="Loading...">
				<OrderList completed={completedDef} orders={orders} setOrders={setOrders}/>
			</React.Suspense>
				<ScrollBar/>
			</ScrollArea>
		</div>
	)
}
