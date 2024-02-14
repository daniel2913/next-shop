"use client"

import { PopulatedProduct } from "@/lib/Models/Product"
import React from "react"
import GenericSelectTable from "@comps/ui/GenericSelectTable"
import { EditProduct } from "./ContextMenu"
import { useRouter } from "next/navigation"
import { Label } from "@comps/ui/Label"
import { Input } from "@comps/ui/Input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@comps/ui/Tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@comps/ui/Accordion"

type Props =
	{
		name?: string
		value: number[]
		products: PopulatedProduct[]
		onChange: (val: number[]) => void
		config?: boolean
	}

function BrandTable(props:Props){
	const router = useRouter()
	return (
		<GenericSelectTable
		name={props.name}
		columns={{
			Id:(prod)=>prod.id,
			Name:(prod)=>prod.name,
			Category:(prod)=>prod.category.name,
			Price:(prod)=>prod.price,
			Edit:(prod)=><EditProduct product={prod} onClose={()=>router.refresh()}/>
		}}
		items={props.products}
		value={props.value}
		onChange={props.onChange}
		/>
	)
}
function CategoryTable(props:Props){
	const router = useRouter()
	return (
		<GenericSelectTable
		name={props.name}
		columns={{
			Id:(prod)=>prod.id,
			Name:(prod)=>prod.name,
			Brand:(prod)=>prod.brand.name,
			Price:(prod)=>prod.price,
			Edit:(prod)=><EditProduct product={prod} onClose={()=>router.refresh()}/>
		}}
		items={props.products}
		value={props.value}
		onChange={props.onChange}
		/>
	)
}


const ProductList = React.memo(function ProductList(props: Props) {
	const [filter, setFilter] = React.useState("")
	const products = props.products.filter(prod => prod.name.toLowerCase().includes(filter.toLowerCase()))
	const grouped = React.useMemo(() => {
		const productsByBrand: Record<string, PopulatedProduct[]> = {}
		const productsByCategory: Record<string, PopulatedProduct[]> = {}
		if (!products) return { productsByBrand, productsByCategory }
		for (const product of products) {
			if (productsByBrand[product.brand.name])
				productsByBrand[product.brand.name].push(product)
			else
				productsByBrand[product.brand.name] = [product]
			if (productsByCategory[product.category.name])
				productsByCategory[product.category.name].push(product)
			else
				productsByCategory[product.category.name] = [product]
		}
		return { productsByBrand, productsByCategory }
	}, [products])
	return (
		<>
			<Label>
				Name Filter
				<Input
					name="Name Filter"
					value={filter}
					onChange={(e) => setFilter(e.currentTarget.value)}
				/>
			</Label>
			<Tabs defaultValue="brand">
				<TabsList defaultValue="brand">
					<TabsTrigger value="brand">
						Sort by Brand
					</TabsTrigger>
					<TabsTrigger value="category">
						Sort by Category
					</TabsTrigger>
				</TabsList>
				<TabsContent value="brand">
					<Accordion type="multiple">
						{Object.entries(grouped.productsByBrand).map(group =>
							<AccordionItem
								value={group[0]}
								key={`brand-${group[0]}`}
							>
								<AccordionTrigger>
									{group[0]}
								</AccordionTrigger>
								<AccordionContent>
									<BrandTable {...props} products={group[1]} />
								</AccordionContent>
							</AccordionItem>)
						}
					</Accordion>
				</TabsContent>
				<TabsContent value="category">
					<Accordion type="multiple">
						{Object.entries(grouped.productsByCategory).map(group =>
							<AccordionItem
								value={group[0]}
								key={`category-${group[0]}`}
							>
								<AccordionTrigger>
									{group[0]}
								</AccordionTrigger>
								<AccordionContent>
									<CategoryTable {...props} products={group[1]}/>
								</AccordionContent>
							</AccordionItem>)
						}
					</Accordion>
				</TabsContent>
			</Tabs>
		</>
	)
})
export default ProductList
