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
		const productsByBrand: Record<string, PopulatedProduct[]> = {};
		const productsByCategory: Record<string, PopulatedProduct[]> = {};
		if (!products) return { productsByBrand, productsByCategory };
		for (const product of products) {
			if (productsByBrand[product.brand.name])
				productsByBrand[product.brand.name].push(product);
			else productsByBrand[product.brand.name] = [product];
			if (productsByCategory[product.category.name])
				productsByCategory[product.category.name].push(product);
			else productsByCategory[product.category.name] = [product];
		}
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
