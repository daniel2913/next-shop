"use client"

import { Category } from "@/lib/Models"
import { useRouter } from "next/navigation"
import React from "react"
import { Button } from "@/components//ui/Button"
import Edit from "@public/edit.svg"
import DiscountForm from "@/components/forms/DiscountForm"
import CategoryForm from "@/components/forms/CategoryForm"
import { deleteCategoriesAction } from "@/actions/category"
import GenericSelectTable from "@/components/ui/GenericSelectTable"
import { useModalStore } from "@/store/modalStore"
import { useToastStore } from "@/store/ToastStore"

type Props = {
	categories: Category[]
	className?: string
}

export default function CategoriesAdmin({ categories, className }: Props) {
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
					onClick={async () => {
						await show(<CategoryForm />)
						router.refresh()
					}}
				>
					Create
				</Button>
				<Button
					disabled={loading || selected.length === 0}
					onClick={async () => {
						setLoading(true)
						const res = await deleteCategoriesAction(selected)
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
					onClick={() => {
						show(<DiscountForm discount={{ categories: selected }} />)
					}}
				>
					Discount
				</Button>
			</div>
			<GenericSelectTable
				items={categories}
				value={selected}
				onChange={onChange}
				columns={{
					Id: (s) => s.id,
					Name: (s) => s.name,
					Edit: (s) => (
						<Button
							onClick={() =>
								show(<CategoryForm category={s} />).then(() => router.refresh())
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
