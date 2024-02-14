"use client"

import { PopulatedProduct } from "@/lib/DAL/Models/Product"
import React from "react"
import { Accordion, AccordionContent } from "@/components/UI/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table"
import Input from "../Input"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "../tabs"
import { AccordionItem, AccordionTrigger } from "@comps/UI/accordion"
import { Label } from "@comps/UI/label"
import { EditProduct } from "@/components/product/ContextMenu"
import { useRouter } from "next/navigation"
type Props =
	{
		name?: string
		value: number[]
		products: PopulatedProduct[]
		onChange: (val: number[]) => void
		config?: boolean
	}


type GenericProps<T extends (Record<string, any>&{id:number})[]> = {
	value: number[]
	onChange: (val: number[]) => void
	name?: string
	items: T
	columns: Record<string, (s: T[number]) => T[number][string]>
}

export function GenericTable<T extends (Record<string, any>&{id:number})[]>(props: GenericProps<T>) {
	function onClick(id: number) {
		if (props.value.includes(id))
			props.onChange(props.value.filter(old => old !== id)
			)
		else
			props.onChange([...props.value, id])
	}
	function onGroupClick() {
		const newState = props.value.
			filter(old => props.items
				.every(prod => prod.id !== old)
			)
		if (props.items.map(item => item.id).
			every(id => props.value.includes(id))
		)
			props.onChange(newState)
		else
			props.onChange(newState.concat(props.items.map(item => item.id)))
	}
	const columnNames = Object.keys(props.columns)
	return (
		<Table>
			<TableHeader>
				<TableRow className="*:text-center">
					<TableHead>
						<input
							type="checkbox"
							onChange={onGroupClick}
							checked={props.items.map(item => item.id).every(id => props.value.includes(id))}
						/>
					</TableHead>
				{columnNames.map((col, idx) =>
					<TableHead key={`${col}-${idx}`}>
						{col}
					</TableHead>
				)
				}
				</TableRow>
			</TableHeader>
			<TableBody>
				{props.items.map((item, idx) =>
					<TableRow
						key={`${item.id}`}
						onClick={() => onClick(item.id)}
						className={`cursor-pointer *>text-center text-center bg-blend-lighten hover:bg-accent/10`}
					>
						<TableCell>
							<input
								type="checkbox"
								value={item.id}
								name={props.name}
								onChange={() => onClick(item.id)}
								checked={props.value.includes(item.id)}
							/>
						</TableCell>
						{columnNames.map((col, idx) =>
							<TableCell key={`${col}-${idx}`}>
								{props.columns[col](item)}
							</TableCell>
						)}
					</TableRow>
				)}
			</TableBody>
		</Table>
	)
}

function BrandTable(props:Props){
	const router = useRouter()
	return (
		<GenericTable
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
		<GenericTable
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
