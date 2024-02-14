
"use client"

import useToast from "@/hooks/modals/useToast"
import { Category } from "@/lib/DAL/Models"
import { useRouter } from "next/navigation"
import React from "react"
import { Button } from "../UI/button"
import { GenericTable } from "../UI/ProductList"
import Edit from "@public/edit.svg"
import useModal from "@/hooks/modals/useModal"
import { deleteBrandsAction } from "@/actions/brand"
import DiscountForm from "../forms/DiscountForm"
import CategoryForm from "../forms/CategoryForm"
import { deleteCategoriesAction } from "@/actions/category"

type Props = {
	categories: Category[]
	className?: string
}

export default function CategoriesAdmin({ categories, className }: Props) {
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
					onClick={async ()=>{
						await show(<CategoryForm/>)
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
						if (handleResponse(res))
							router.refresh()
						setLoading(false)
					}}>
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
			<GenericTable
				items={categories}
				value={selected}
				onChange={onChange}
				columns={{
					Id: s => s.id,
					Name: s => s.name,
					Edit: s =>
						<Button
							onClick={() => show(<CategoryForm category={s} />).then(() => router.refresh())}
							className="bg-transparent appearance-none hover:bg-transparent"
						>
							<Edit width={30} height={30} />
						</Button>
				}}
			/>
		</div>
	)
}
