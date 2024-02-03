"use client"
import Form from "./index"
import React from "react"
import { changeDiscountAction, createDiscountAction } from "@/actions/discount"
import CheckBoxBlock from "../UI/CheckBoxBlock"
import { getAllBrandNamesAction } from "@/actions/brand"
import { getAllCategoryNamesAction } from "@/actions/category"
import ProductList from "../UI/ProductList"
import useAction from "@/hooks/useAction"
import { Slider } from "../UI/Slider.tsx"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../UI/accordion.tsx"
import Input from "../UI/Input/index.tsx"

const validation = {
	discount: (discount: number) => {
		if (discount < 1) return "Greater than 0"
		if (discount > 99) return "Less than 100"
		if (Number.isInteger(discount)) return "Only integers"
		return false
	}
}

type Props = {
	discount?: {
		id: number
		discount: number
		brands: string[]
		categories: string[]
		products: number[]
		expires: Date
	}
}

export default function DiscountForm({ discount }: Props) {

	const action = discount?.id
		? (form: FormData) => changeDiscountAction(discount.id, form)
		: createDiscountAction

	const [value, setValue] = React.useState(discount?.discount || 50)
	const [brands, setBrands] = React.useState(discount?.brands || [])
	const [categories, setCategories] = React.useState(discount?.categories || [])
	const [expires, setExpires] = React.useState(discount?.expires || new Date(Date.now() + 1000 * 60 * 60 * 24))
	const [products, setProducts] = React.useState(discount?.products || [])

	const { value: allBrands } = useAction(getAllBrandNamesAction, [])
	const { value: allCategories } = useAction(getAllCategoryNamesAction, [])

	return (
		<Form
			validations={validation}
			className=""
			action={action}
		>
			{value}
			<Slider
				value={[value]}
				onValueChange={(e) => setValue(Math.floor(e[0]))}
				max={99}
				min={1}
				title="Discount"
				id="discount"
				name="discount"
			/>
			<Accordion type="multiple" title="Brands">
				<AccordionItem value="brands">
					<AccordionTrigger>
						Brands
					</AccordionTrigger>
					<AccordionContent>
						<CheckBoxBlock
							className="flex flex-col gap-2 text-secondary-foreground"
							id="brands"
							view="text"
							value={brands}
							setValue={(val) => setBrands(val)}
							options={allBrands}
						/>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="categories">
					<AccordionTrigger>
						Brands
					</AccordionTrigger>
					<AccordionContent>
						<CheckBoxBlock
							className="flex flex-col gap-2 text-secondary-foreground"
							id="categories"
							view="text"
							value={categories}
							setValue={(val) => setCategories(val)}
							options={allCategories}
						/>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem title="Products" value="products">
					<AccordionTrigger>
						Products
					</AccordionTrigger>
					<AccordionContent>
						<ProductList
							name="products"
							value={products}
							onChange={(id: number) => {
								if (products.includes(id))
									setProducts(products => products.filter(prod => prod !== id))
								else
									setProducts(products => [...products, id])
							}}
						/>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
			<input
				id="expires"
				name="expires"
				//label="Expires"
				type="datetime-local"
				value={expires.toJSON().slice(0, 16)}
				onChange={(e) => {
					console.log(expires, e, e.currentTarget.value)
					setExpires(new Date(e.currentTarget.value))
				}
				}
			/>
		</Form>
	)
}
