"use client"

import useToast from "@/hooks/modals/useToast"
import { Discount } from "@/lib/Models"
import { useRouter } from "next/navigation"
import React from "react"
import { Button } from "@/components/ui/Button"
import Edit from "@public/edit.svg"
import useModal from "@/hooks/modals/useModal"
import { deleteDiscountsAction } from "@/actions/discount"
import DiscountForm from "@/components/forms/DiscountForm"
import GenericSelectTable from "@/components/ui/GenericSelectTable"

type Props = {
	discounts: Discount[]
	className?: string
}

export default function DiscountsAdmin({ discounts, className }: Props) {
	const [selected, setSelected] = React.useState<number[]>([])
	const [loading, setLoading] = React.useState(false)
	const { show } = useModal()
	const { handleResponse } = useToast()
	const router = useRouter()
	const onChange = (ids: number[]) => setSelected(ids)
	return (
		<div className={`${className} flex flex-col`}>
			<div className="flex gap-4">
				<Button
					disabled={loading || selected.length === 0}
					onClick={async () => {
						setLoading(true)
						const res = await deleteDiscountsAction(selected)
						if (handleResponse(res)) {
							setSelected([])
							router.refresh()
						}
						setLoading(false)
					}}
				>
					Delete
				</Button>
			</div>
			<GenericSelectTable
				items={discounts}
				value={selected}
				onChange={onChange}
				columns={{
					Id: (s) => s.id,
					Discount: (s) => s.discount,
					Products: (s) => s.products.length,
					Brands: (s) => s.brands.length,
					Categories: (s) => s.categories.length,
					Expires: (s) =>
						+s.expires > Date.now() ? s.expires.toUTCString() : "Expired",
					Edit: (s) => (
						<Button
							onClick={() =>
								show(<DiscountForm discount={s} />).then(() => router.refresh())
							}
							className="appearance-none bg-transparent hover:bg-transparent"
						>
							<Edit
								width={30}
								height={30}
							/>
						</Button>
					),
				}}
			/>
		</div>
	)
}
