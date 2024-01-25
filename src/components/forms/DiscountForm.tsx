"use client"
import Form from "./index"
import React from "react"
import { InputGeneralProps, InputOptionDynamicProps, InputOptionStaticProps } from "@/components/ui/LabeledInput"
import { Brand, Category, Discount } from "@/lib/DAL/Models"
import { changeDiscountAction, createDiscountAction } from "@/actions/discount" 
import { Slider } from "@/components/material-tailwind"

const validation = {
	discount: (discount:number)=>{
		if (discount<1) return "Greater than 0"
		if (discount>99) return "Less than 100"
		if (Number.isInteger(discount)) return "Only integers"
		return false
	}
}

type Props = {
	discount: Discount
}

export default function DiscountForm({discount}: Props) {

	const action = discount.id
		? (form:FormData)=>changeDiscountAction(discount.id,form)
		: createDiscountAction

	const [value, setValue] = React.useState(discount.discount || 50)
	const [brands, setBrands] = React.useState(discount.brands || [])
	const [categories, setCategories] = React.useState(discount.categories || [])
	const [expires,setExpires] = React.useState(discount.expires || Date.now()+1000*60*60*24)

	return (
		<Form
			validations={validation}
			className=""
			action={action}
		>
			<Slider
				value={value}
				max={99}
				min={1}
				title="Discount"
				id="discount"
			/>
		</Form>
	)
}
