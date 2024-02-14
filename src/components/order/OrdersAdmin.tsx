"use client"

import React from "react"
import useToast from "@/hooks/modals/useToast"
import useModal from "@/hooks/modals/useModal"
import { useRouter } from "next/navigation"
import { Button } from "../UI/button"
import { PopulatedOrder, deleteOrdersAction } from "@/actions/order"
import OrderList from "./OrderList"
import useConfirm from "@/hooks/modals/useConfirm"


type Props = {
	orders:{
		completed:PopulatedOrder[]
		processing:PopulatedOrder[]
	}
	className?: string
}




export default function OrdersAdmin({orders,className}:Props){
	const [selected, setSelected] = React.useState<number[]>([])
	const [loading, setLoading] = React.useState(false)
	const { handleResponse } = useToast()
	const {show} = useModal()
	const confirm = useConfirm()
	const router = useRouter()
	const onChange = (ids: number[]) => setSelected(ids)
	return (
		<div className={`${className} flex flex-col gap-2`}>
			<div className="flex gap-4">
				<Button
					disabled={loading}
					onClick={async () => {
						const ans = await confirm("Are you sure? This may be confusing for users")
						if (!ans) return
						setLoading(true)
						const res = await deleteOrdersAction(selected)
						if (handleResponse(res))
							router.refresh()
						setLoading(false)
				}}>
					Delete
				</Button>
			</div>
			<OrderList config orders={orders} value={selected} onChange={onChange} />
		</div>
	)
}
