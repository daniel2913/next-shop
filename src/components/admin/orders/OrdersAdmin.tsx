"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../ui/Button"
import { PopulatedOrder, deleteOrdersAction } from "@/actions/order"
import OrdersAdminTabs from "./OrderAdminTabs"
import useConfirm from "@/hooks/modals/useConfirm"
import { useToastStore } from "@/store/ToastStore"

type Props = {
	orders: {
		completed: PopulatedOrder[]
		processing: PopulatedOrder[]
	}
	className?: string
}

export default function OrdersAdmin({ orders, className }: Props) {
	const [selected, setSelected] = React.useState<number[]>([])
	const [loading, setLoading] = React.useState(false)
	const isValidResponse = useToastStore((s) => s.isValidResponse)
	const confirm = useConfirm()
	const router = useRouter()
	const onChange = (ids: number[]) => setSelected(ids)
	return (
		<div className={`${className} flex flex-col gap-2`}>
			<div className="flex gap-4">
				<Button
					disabled={loading}
					onClick={async () => {
						const ans = await confirm(
							"Are you sure? This may be confusing for users"
						)
						if (!ans) return
						setLoading(true)
						const res = await deleteOrdersAction(selected)
						if (isValidResponse(res)) {
							setSelected([])
							router.refresh()
						}
						setLoading(false)
					}}
				>
					Delete
				</Button>
			</div>
			<OrdersAdminTabs
				config
				orders={orders}
				value={selected}
				onChange={onChange}
			/>
		</div>
	)
}
