"use client"
import Accordion from "@/components/UI/Acordion"
import { completeOrder, getOrdersAction } from "@/actions/order"
import React, { Suspense }  from "react"
import useAction from "@/hooks/useAction"
import { Button, Switch } from "@/components/material-tailwind"
import { useSession } from "next-auth/react"

const List = React.memo(function List({completed}:{completed:boolean}){
	const session = useSession()
	const {value:orders,setValue:setOrders,reload} = useAction(getOrdersAction,{completed:[],processing:[]})
	return(<>
		<Button onClick={()=>reload()}>Reload</Button>
		{(completed ? orders?.completed||[] : orders?.processing||[])
				.map((order) => {
			const data = {
				user: +order.order.user,
				id: +order.order.id,
				prodIds: Object.keys(order.order.order).map(Number),
			}
			return (
				<Accordion
					key={order.order.id}
					className=""
					label={`Order-${order.order.id} - ${order.order.user}`}
				>
					{[
						<table
							key={order.order.id + "table"}
							className="w-full"
						>
							<thead>
								<tr
									className="flex flex-initial justify-evenly justify-items-center"
								>
									<th className="basis-1/12">ID</th>
									<th className="basis-1/3">Product Name</th>
									<th className="basis-1/4">Brand</th>
									<th className="basis-1/12">Amount</th>
								</tr>
							</thead>
							<tbody>
								{order.products.map((product) => {
									return (
										<tr
											key={`${product.id}-${order.order.id}`}
											className="flex justify-evenly justify-items-center"
										>
											<td className="basis-1/12 text-center">{product.id}</td>
											<td className="basis-1/3 text-center">{product.name}</td>
											<td className="basis-1/4 text-center">{product.brand.name}</td>
											<td className="basis-1/12 text-center">{order.order.order[product.id].amount}</td>
										</tr>
									)
								})}
							</tbody>
						</table>,
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
				</Accordion>
			)
		}
		)}
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
				crossOrigin={"false"}
				checked={completed}
				onChange={() => setCompleted(c => !c)}
			/>
			</div>
			<Suspense fallback="Loading...">
			<List completed={completedDef}/>
			</Suspense>
		</div>
	)
}
