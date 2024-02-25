"use client"

import { Discount } from "@/lib/Models"
import { useRouter } from "next/navigation"
import React, { isValidElement } from "react"
import { Button } from "@/components/ui/Button"
import Edit from "@public/edit.svg"
import { deleteDiscountsAction } from "@/actions/discount"
import DiscountForm from "@/components/forms/DiscountForm"
import GenericSelectTable from "@/components/ui/GenericSelectTable"
import { useModalStore } from "@/store/modalStore"
import { useToastStore } from "@/store/ToastStore"

type Props = {
	discounts: Discount[]
	className?: string
}

export default function DiscountsAdmin({ discounts, className }: Props) {
	const [selected, setSelected] = React.useState<number[]>([])
	const [loading, setLoading] = React.useState(false)
	const show = useModalStore((s) => s.show)
	const isValidResponse = useToastStore((s) => s.isValidResponse)
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
