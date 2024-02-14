"use client"

import React from "react"
import { Accordion, AccordionContent } from "@comps/ui/Accordion"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@comps/ui/Tabs"
import { AccordionItem, AccordionTrigger } from "@comps/ui/Accordion"
import { useRouter } from "next/navigation"
import { Button } from "../ui/Button"
import { PopulatedOrder, completeOrderAction } from "@/actions/order"
import useToast from "@/hooks/modals/useToast"
import useModal from "@/hooks/modals/useModal"
import { CartTable } from "../cart/Cart"
import GenericSelectTable from "../ui/GenericSelectTable"

type Props =
	{
		name?: string
		value: number[]
		orders: {
			completed: PopulatedOrder[]
			processing: PopulatedOrder[]
		}
		onChange: (val: number[]) => void
		config?: boolean
	}




function OrderTable(props:Omit<Props,"orders">&{orders:PopulatedOrder[]}) {
	const router = useRouter()
	const {handleResponse} = useToast()
	const [loading,setLoading] = React.useState(false)
	const {show} = useModal()
	return (
		<GenericSelectTable
			name={props.name}
			columns={{
				Id: order => order.id,
				Value: order => Object.values(order.order).reduce((sum, order) => sum + order.price * order.amount, 0),
				Details: order=>
					<Button onClick={()=>show(<CartTable products={order.products} order={order.order}/>)}>
						Details
					</Button>,
				Complete: order =>
					<Button
						disabled={loading||order.status!=="PROCESSING"}
						className=""
						onClick={async () => {
							setLoading(true)
							const res = await completeOrderAction(order.id)
							if (handleResponse(res))
								router.refresh()	
							setLoading(false)
						}}
						>
						Complete
					</Button>
			}}
			items={props.orders.map(order=>({...order.order,products:order.products}))}
			value={props.value}
			onChange={props.onChange}
		/>
	)
}



const OrderList = React.memo(function OrderList(props: Props) {
	console.log(props.orders)
	const grouped = React.useMemo(() => {
		const completed: Record<number, PopulatedOrder[]> = {}
		const processing: Record<number, PopulatedOrder[]> = {}
		for (const order of props.orders.processing) {
			if (processing[order.order.user])
				processing[order.order.user].push(order)
			else
				processing[order.order.user] = [order]
		}
		for (const order of props.orders.completed) {
			if (completed[order.order.user])
				completed[order.order.user].push(order)
			else
				completed[order.order.user] = [order]
		}
		return { processing, completed }
	}, [props.orders])
	console.log(grouped)
	return (
		<>
			<Tabs defaultValue="processing">
				<TabsList defaultValue="processing">
					<TabsTrigger value="processing">
						Processing
					</TabsTrigger>
					<TabsTrigger value="completed">
						Completed
					</TabsTrigger>
				</TabsList>
				<TabsContent value="processing">
					<Accordion type="multiple">
						{Object.entries(grouped.processing).map(group =>
							<AccordionItem
								value={group[0]}
								key={`user-${group[0]}`}
							>
								<AccordionTrigger>
									{group[0]}
								</AccordionTrigger>
								<AccordionContent>
									<OrderTable {...props} orders={group[1]} />
								</AccordionContent>
							</AccordionItem>)
						}
					</Accordion>
				</TabsContent>
				<TabsContent value="completed">
					<Accordion type="multiple">
						{Object.entries(grouped.completed).map(group =>
							<AccordionItem
								value={group[0]}
								key={`user-${group[0]}`}
							>
								<AccordionTrigger>
									{group[0]}
								</AccordionTrigger>
								<AccordionContent>
									<OrderTable {...props} orders={group[1]} />
								</AccordionContent>
							</AccordionItem>)
						}
					</Accordion>
				</TabsContent>
			</Tabs>
		</>
	)
})
export default OrderList
