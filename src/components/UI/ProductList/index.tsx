"use client"

import { getAllProductsAction } from "@/actions/product"
import useAction from "@/hooks/useAction"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"
import React from "react"
import {Accordion, AccordionContent} from "@/components/UI/accordion"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../table"
import Input from "../Input"
import {Tabs,TabsList,TabsContent,TabsTrigger} from "../tabs"
import { AccordionItem, AccordionTrigger } from "@comps/UI/accordion"
type Props =
	{
		name?: string
		value: number[]
		onChange: (val: number) => void
	}

const ProductList = React.memo(function ProductList(props: Props) {
	const { value: products } = useAction(getAllProductsAction, [])
	const [filter, setFilter] = React.useState("")
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
			<Input
				name="Name Filter"
				value={filter}
				onChange={(e) => setFilter(e.currentTarget.value)}
			/>
			<Tabs>
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
									<Table>
										<TableHeader>
											<TableRow>
												<th>  </th>
												<th>ID</th>
												<th>Name</th>
												<th>Category</th>
												<th>Price</th>
											</TableRow>
										</TableHeader>
										<TableBody>
											{group[1].filter(prod => prod.name.includes(filter)).map(product =>
												<TableRow
													key={`brand-${product.brand}-${product.name}`}
													onClick={() => props.onChange(product.id)}
													className={`cursor-pointer bg-blend-lighten hover:bg-accent1-100`}
												>
													<TableCell>
														<input
															type="checkbox"
															value={product.id}
															name={props.name}
															onChange={() => props.onChange(product.id)}
															checked={props.value.includes(product.id)}
														/>
													</TableCell>
													<TableCell>{product.id}</TableCell>
													<TableCell>{product.name}</TableCell>
													<TableCell>{product.category.name}</TableCell>
													<TableCell>{product.price}</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
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
									<Table>
										<TableHeader>
											<TableRow>
												<th>  </th>
												<th>ID</th>
												<th>Name</th>
												<th>Brand</th>
												<th>Price</th>
											</TableRow>
										</TableHeader>
										<TableBody>
											{group[1].filter(prod => prod.name.includes(filter)).map(product =>
												<TableRow
													key={`brand-${product.brand}-${product.name}`}
													onClick={() => props.onChange(product.id)}
													className={`cursor-pointer bg-blend-lighten hover:bg-accent1-100`}
												>
													<TableCell>
														<input
															type="checkbox"
															value={product.id}
															name={props.name}
															onChange={() => props.onChange(product.id)}
															checked={props.value.includes(product.id)}
														/>
													</TableCell>
													<TableCell>{product.id}</TableCell>
													<TableCell>{product.name}</TableCell>
													<TableCell>{product.brand.name}</TableCell>
													<TableCell>{product.price}</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
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
