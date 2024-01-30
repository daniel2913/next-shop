"use client"

import { getAllProductsAction } from "@/actions/product"
import useAction from "@/hooks/useAction"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"
import { Checkbox, Input, Tab, TabPanel, Tabs, TabsBody, TabsHeader } from "@/components/material-tailwind"
import React from "react"
import Accordion from "@/components/UI/Acordion"
type Props =
	{
		name?: string
		value: number[]
		onChange: (val: number) => void
	}

export default function ProductList(props: Props) {
	const products = useAction(getAllProductsAction)
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
				label="Name Filter"
				crossOrigin={"false"}
				value={filter}
				onChange={(e) => setFilter(e.currentTarget.value)}
			/>
			<Tabs
				value="brand"
			>
				<TabsHeader>
					<Tab value="brand">
						Sort by Brand
					</Tab>
					<Tab value="category">
						Sort by Category
					</Tab>
				</TabsHeader>
				<TabsBody animate={{}}>
					<TabPanel value="brand">
						{Object.entries(grouped.productsByBrand).map(group =>
							<Accordion
								key={group[0]}
								className=""
								label={group[0]}
							>{[
								<table key="1">
									{group[1].filter(prod => prod.name.includes(filter)).map(product =>
										<tr
											key={`${product.brand}-${product.name}`}
											onClick={() => props.onChange(product.id)}
										>
											<th>
												<input
													type="checkbox"
													value={product.id}
													name={props.name}
													onChange={() => props.onChange(product.id)}
													checked={props.value.includes(product.id)}
												/>
											</th>
											<th>{product.id}</th>
											<th>{product.name}</th>
											<th>{product.category.name}</th>
											<th>{product.price}</th>
										</tr>
									)}
								</table>

								, <></>]}
							</Accordion>)
						}
					</TabPanel>
					<TabPanel value="category">
						{Object.entries(grouped.productsByCategory).map(group =>
							<Accordion
								key={group[0]}
								className=""
								label={group[0]}
							>{
									<table 
										className="w-full grid grid-cols-[2rem,4ch,2fr,1fr,10ch]"
									>
										{group[1].filter(prod => prod.name.includes(filter)).map(product =>
											<tr
												key={`${product.brand}-${product.name}`}
												onClick={() => props.onChange(product.id)}
												className={`
													cursor-pointer grid col-span-5 grid-cols-[subgrid]
													bg-blend-lighten hover:bg-accent1-100
												`}
											>
												<th
													className=""
												>
													<input
														type="checkbox"
														value={product.id}
														name={props.name}
														onChange={() => props.onChange(product.id)}
														checked={props.value.includes(product.id)}
													/>
												</th>
												<th>{product.id}</th>
												<th>{product.name}</th>
												<th>{product.brand.name}</th>
												<th>{product.price.toFixed(2)}</th>
											</tr>
										)}
									</table>}
							</Accordion>)
						}
					</TabPanel>
				</TabsBody>
			</Tabs>
		</>
	)
}
