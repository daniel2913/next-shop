"use client"

import { Brand } from "@/lib/Models"
import { useRouter } from "next/navigation"
import React from "react"
import { Button } from "@/components/ui/Button"
import Edit from "@public/edit.svg"
import BrandForm from "@/components/forms/BrandForm"
import { deleteBrandsAction } from "@/actions/brand"
import DiscountForm from "@/components/forms/DiscountForm"
import useConfirm from "@/hooks/modals/useConfirm"
import GenericSelectTable from "@/components/ui/GenericSelectTable"
import { useModalStore } from "@/store/modalStore"
import { useToastStore } from "@/store/ToastStore"

type Props = {
	brands: Brand[]
	className?: string
}

export default function BrandsAdmin({ brands, className }: Props) {
	const [selected, setSelected] = React.useState<number[]>([])
	const confirm = useConfirm()
	const [loading, setLoading] = React.useState(false)
	const show = useModalStore((s) => s.show)
	const isValidResponse = useToastStore((s) => s.isValidResponse)
	const router = useRouter()
	const onChange = (ids: number[]) => setSelected(ids)
	return (
		<div className={`${className} flex flex-col`}>
			<div className="flex gap-4">
				<Button
					onClick={async () => {
						await show(<BrandForm />)
						router.refresh()
					}}
				>
					Create
				</Button>
				<Button
					disabled={loading || selected.length === 0}
					onClick={async () => {
						const ans = await confirm(
							"Are you sure? This will also delete all dependant products"
						)
						if (!ans) return
						setLoading(true)
						const res = await deleteBrandsAction(selected)
						if (isValidResponse(res)) {
							setSelected([])
							router.refresh()
						}
						setLoading(false)
					}}
				>
					Delete
				</Button>
				<Button
					disabled={selected.length === 0}
					onClick={async () => {
						await show(<DiscountForm discount={{ brands: selected }} />)
						setSelected([])
					}}
				>
					Discount
				</Button>
			</div>
			<GenericSelectTable
				items={brands}
				value={selected}
				onChange={onChange}
				columns={{
					Id: (s) => s.id,
					Name: (s) => s.name,
					Edit: (s) => (
						<Button
							onClick={() =>
								show(<BrandForm brand={s} />).then(() => router.refresh())
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
