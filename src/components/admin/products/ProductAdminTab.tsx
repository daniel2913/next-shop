"use client"
import Edit from "@/../public/edit.svg"
import { PopulatedProduct } from "@/lib/Models/Product"
import React from "react"
import GenericSelectTable from "@/components/ui/GenericSelectTable"
import { useRouter } from "next/navigation"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/Accordion"
import ProductForm from "../../forms/ProductForm"
import { Button } from "../../ui/Button"
import { useModalStore } from "@/store/modalStore"

export type Props = {
	name?: string
	value: number[]
	products: PopulatedProduct[]
	onChange: (val: number[]) => void
	config?: boolean
}

type ProductAdminTabProps = {
	group: Record<string, PopulatedProduct[]>
} & Props
export function ProductsAdminTab({ group, ...props }: ProductAdminTabProps) {
	return (
		<Accordion type="multiple">
			{Object.entries(group).map((group) => (
				<AccordionItem
					value={group[0]}
					key={`brand-${group[0]}`}
				>
					<AccordionTrigger>{group[0]}</AccordionTrigger>
					<AccordionContent>
						<GenericProductTable
							{...props}
							products={group[1]}
							brandOrCategory="brand"
							brandOrCategorySelector={(prod) => prod.category.name}
						/>
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	)
}

type GenericProductTableProps = {
	brandOrCategory: "brand" | "category"
	brandOrCategorySelector: (prod: PopulatedProduct) => string
	name?: string
	value: number[]
	products: PopulatedProduct[]
	onChange: (val: number[]) => void
}

function GenericProductTable(props: GenericProductTableProps) {
	const router = useRouter()
	const show = useModalStore((s) => s.show)
	return (
		<GenericSelectTable
			name={props.name}
			columns={{
				Id: (prod) => prod.id,
				Name: (prod) => prod.name,
				[props.brandOrCategory]: props.brandOrCategorySelector,
				Price: (prod) => prod.price,
				Edit: (prod) => (
					<Button
						className={`flex w-full appearance-none justify-between bg-transparent p-0 hover:bg-transparent`}
						onClick={() => {
							show(<ProductForm product={prod} />).then(() => router.refresh())
						}}
					>
						<Edit
							className="hover:stroke-accent"
							width={"30px"}
							height={"30px"}
						/>
					</Button>
				),
			}}
			items={props.products}
			value={props.value}
			onChange={props.onChange}
		/>
	)
}
