"use client"
import { completeOrder, getOrdersAction } from "@/actions/order"
import React, { Suspense }  from "react"
import useAction from "@/hooks/useAction"
import {Button} from "@/components/UI/button"
import { Switch } from "@/components/UI/switch"
import { useSession } from "next-auth/react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/UI/accordion"
import { Table,TableHead,TableBody,TableRow,TableCell } from "@/components/UI/table"

const List = React.memo(function List({completed}:{completed:boolean}){
	const session = useSession()
	const {value:orders,setValue:setOrders,reload} = useAction(getOrdersAction,{completed:[],processing:[]})
	return(<>
		<Button onClick={()=>reload()}>Reload</Button>
		<Accordion 
			type="multiple"
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
				<AccordionContent>
					{[
						<Table
							key={order.order.id + "table"}
							className="w-full"
						>
							<TableHead>
								<TableRow
									className="flex flex-initial justify-evenly justify-items-center"
								>
									<TableCell className="basis-1/12">ID</TableCell>
									<TableCell className="basis-1/3">Product Name</TableCell>
									<TableCell className="basis-1/4">Brand</TableCell>
									<TableCell className="basis-1/12">Amount</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{order.products.map((product) => {
									return (
										<TableRow
											key={`${product.id}-${order.order.id}`}
											className="flex justify-evenly justify-items-center"
										>
											<TableCell className="basis-1/12 text-center">{product.id}</TableCell>
											<TableCell className="basis-1/3 text-center">{product.name}</TableCell>
											<TableCell className="basis-1/4 text-center">{product.brand.name}</TableCell>
											<TableCell className="basis-1/12 text-center">{order.order.order[product.id].amount}</TableCell>
										</TableRow>
									)
								})}
							</TableBody>
						</Table>,
						session?.data?.user?.role === "admin" && order.order.status === "PROCESSING"
							?
								<Button
									color="cyan"
									className="block ml-auto"
									onClick={async ()=>{
											const res = await completeOrder(data.id)
											if (!res)
												setOrders({
												completed:[...orders!.completed,orders!.processing.find(o=>o?.order.id===order.order.id)!],
												processing:orders?.processing.filter(o=>o.order?.id!==order.order.id)!
												})
										return res
									}}
								>
									Complete
								</Button>
							: <></>
					]}
				</AccordionContent>
				</AccordionItem>
			)
		}
		)}
		</Accordion>
	</>)
})


export default function OrderList() {
	const [completed, setCompleted] = React.useState(false)
	const completedDef = React.useDeferredValue(completed)
	return (
		<div className="h-[70vh] w-[40vw] relative">
			<div className="ml-auto w-fit items-center flex flex-col">
			<label
				htmlFor="completed"
				className={`font-semibold transition-colors ${completed ? "text-brown-800" :"text-blue-gray-500"}`}
			>
				COMPLETED
			</label>
			<Switch
				id="completed"
				checked={completed}
				onCheckedChange={setCompleted}
			/>
			</div>
			<Suspense fallback="Loading...">
			<List completed={completedDef}/>
			</Suspense>
		</div>
	)
}
