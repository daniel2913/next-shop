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
	discount?: Partial<{
		id: number
		discount: number
		brands: number[]
		categories: number[]
		products: number[]
		expires: Date
	}>
}

export default function DiscountForm({ discount }: Props) {

	const action = discount?.id !== undefined
		? (form: FormData) => changeDiscountAction(discount!.id, form)
		: createDiscountAction

	const [value, setValue] = React.useState(discount?.discount || 50)
	const [expires, setExpires] = React.useState(discount?.expires || new Date(Date.now() + 1000 * 60 * 60 * 24))


	return (
		<Form
			validations={validation}
			className=""
			action={action}
		>
			<span>
			{`Discount will affect:\n`}
			{(discount?.products?.length || "" )&& `${discount?.products?.length} products`}
			{(discount?.brands?.length || "" )&& `${discount?.brands?.length} brands`}
			{(discount?.categories?.length || "" )&& `${discount?.categories?.length} categories`}
			</span>
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
			<input
				id="expires"
				name="expires"
				//label="Expires"
				type="datetime-local"
				value={expires.toJSON().slice(0, 16)}
				onChange={(e) => {
					setExpires(new Date(e.currentTarget.value))
				}
				}
			/>
			{(discount?.products || []).map(product=>
				<input type="checkbox" checked name="products" value={product} hidden readOnly />
			)}
			{(discount?.brands || []).map(brand=>
				<input type="checkbox" checked name="brands" value={brand} hidden readOnly />
			)}
			{(discount?.categories || []).map(category=>
				<input type="checkbox" checked name="categories" value={category} hidden readOnly />
			)}
		</Form>
	)
}
