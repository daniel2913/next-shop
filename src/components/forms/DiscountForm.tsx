"use client"
import Form from "./index"
import React from "react"
import { changeDiscountAction, createDiscountAction } from "@/actions/discount" 
import { AccordionBody, AccordionHeader, Button, Input, Popover, PopoverContent, PopoverHandler} from "@/components/material-tailwind"
import Slider from "@/components/UI/Slider"
import CheckBoxBlock from "../UI/CheckBoxBlock"
import useAction from "@/hooks/useAction"
import { getAllBrandNamesAction } from "@/actions/brand"
import { getAllCategoryNamesAction } from "@/actions/category"
import Accordion from "../UI/Acordion"
import useProductList from "@/hooks/useProductList"
import ProductList from "../UI/ProductList"

const validation = {
	discount: (discount:number)=>{
		if (discount<1) return "Greater than 0"
		if (discount>99) return "Less than 100"
		if (Number.isInteger(discount)) return "Only integers"
		return false
	}
}

type Props = {
	discount?:{
		id:number
		discount:number
		brands:string[]
		categories:string[]
		products:number[]
		expires:Date
	}
}

export default function DiscountForm({discount}: Props) {

	const action = discount?.id
		? (form:FormData)=>changeDiscountAction(discount.id,form)
		: createDiscountAction

	const [value, setValue] = React.useState(discount?.discount || 50)
	const [brands, setBrands] = React.useState(discount?.brands || [])
	const [categories, setCategories] = React.useState(discount?.categories || [])
	const [expires,setExpires] = React.useState(discount?.expires || new Date(Date.now()+1000*60*60*24))
	const [products,setProducts] = React.useState(discount?.products || [])
	const allBrands = useAction(getAllBrandNamesAction)
	const allCategories = useAction(getAllCategoryNamesAction)

	return (
		<Form
			validations={validation}
			className=""
			action={action}
		>
			{value}
			<Slider
				value={value}
				onChange={(e)=>setValue(Math.floor(+e.currentTarget.value))}
				max={99}
				min={1}
				title="Discount"
				id="discount"
			/>
			<Accordion label="Brands">
			<CheckBoxBlock
				id="brands"
				view="text"
				value={brands}
				setValue={(val)=>setBrands(val)}
				options={allBrands||[]}
			/>
			</Accordion>
			<Accordion label="Categories">
			<CheckBoxBlock
				id="categories"
				view="text"
				value={categories}
				setValue={(val)=>setCategories(val)}
				options={allCategories||[]}
			/>
			</Accordion>
			<Accordion label="Products">
				<ProductList
					name="products"
					value={products}
					onChange={(id:number)=>{
						if (products.includes(id))
							setProducts(products=>products.filter(prod=>prod!==id))
						else
							setProducts(products=>[...products,id])
					}}
				/>
			</Accordion>
			<Input
				crossOrigin={"false"}
				id="expires"
				name="expires"
				label="Expires l"
				title="Expires t"
				type="datetime-local"
				value={expires.toJSON().slice(0,16)}
				onChange={(e)=>{
					console.log(expires,e,e.currentTarget.value)
					setExpires(new Date(e.currentTarget.value))
					}
				}
			/>
		</Form>
	)
}
