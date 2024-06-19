"use client";
import type { PopulatedProduct } from "@/lib/Models/Product";
import React from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { type Props, ProductsAdminTab } from "./ProductAdminTab";

const ProductsAdminTabs = React.memo(function ProductList(props: Props) {
	const [filter, setFilter] = React.useState("");
	const products = props.products.filter((prod) =>
		prod.name.toLowerCase().includes(filter.toLowerCase()),
	);
	const grouped = React.useMemo(() => {
		const productsByBrand = Object.groupBy(products, v => v.brand.name)
		const productsByCategory = Object.groupBy(products, v => v.category.name)
		return { productsByBrand, productsByCategory };
	}, [products]);
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
					<TabsTrigger value="brand">Sort by Brand</TabsTrigger>
					<TabsTrigger value="category">Sort by Category</TabsTrigger>
				</TabsList>
				<TabsContent value="brand">
					<ProductsAdminTab group={grouped.productsByBrand} {...props} />
				</TabsContent>
				<TabsContent value="category">
					<ProductsAdminTab group={grouped.productsByCategory} {...props} />
				</TabsContent>
			</Tabs>
		</>
	);
});
export default ProductsAdminTabs;
