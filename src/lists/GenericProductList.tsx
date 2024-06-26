"use client";
import { useItemsController } from "@/hooks/useItemsController";
import type { PopulatedProduct } from "@/lib/Models/Product";
import React from "react";
import ProductCard from "../components/product/card";
import Loading from "../components/ui/Loading";
import { getProductsByIdsAction } from "@/actions/product";

export type Props = {
	products: PopulatedProduct[];
};

export function GenericProductList({ products: initProducts }: Props) {
	const {
		items: products,
		reloadOne,
		updateOne,
		loading,
	} = useItemsController({
		initItems: initProducts,
		getItems: getProductsByIdsAction,
	});
	return (
		<Loading loading={loading}>
			{products.map((product, idx) => (
				<ProductCard
					key={product.id}
					{...product}
					reload={reloadOne}
					update={updateOne}
					idx={idx}
					fold={10}
				/>
			))}
		</Loading>
	);
}
