"use client"

import { PopulatedProduct } from "@/lib/Models/Product"
import ProductList from "./ProductAdminTable"
import React from "react"
import { Button } from "@comps/ui/Button"
import { deleteProductsAction } from "@/actions/product"
import useToast from "@/hooks/modals/useToast"
import { useRouter } from "next/navigation"
import ProductForm from "@comps/forms/ProductForm"
import useModal from "@/hooks/modals/useModal"
import DiscountForm from "@comps/forms/DiscountForm"

type Props = {
	products: PopulatedProduct[]
	className?: string
}

export default function ProductsAdmin({ products, className }: Props) {
	const [selected, setSelected] = React.useState<number[]>([])
	const [loading, setLoading] = React.useState(false)
	const { handleResponse } = useToast()
	const {show} = useModal()
	const router = useRouter()
	const onChange = (ids: number[]) => setSelected(ids)
	return (
		<div className={`${className} flex flex-col gap-2`}>
			<div className="flex gap-4">
				<Button
					onClick={async ()=>{
						await show(<ProductForm/>)
						router.refresh()
					}}
				>
					Create
				</Button>
				<Button
					disabled={loading}
					onClick={async () => {
						setLoading(true)
						const res = await deleteProductsAction(selected)
						if (handleResponse(res))
							router.refresh()
						setLoading(false)
				}}>
					Delete
				</Button>
				<Button
					disabled={selected.length === 0}
					onClick={() => {
						show(<DiscountForm discount={{ products: selected }} />)
					}}
				>
					Discount
				</Button>
			</div>
			<ProductList config products={products} value={selected} onChange={onChange} />
		</div>
	)
}
