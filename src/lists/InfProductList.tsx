"use client";
import useInfScroll from "@/hooks/useInfScroll";
import { useSearchController } from "@/hooks/useSearchController";
import { useItemsController } from "@/hooks/useItemsController";
import React from "react";
import ProductCard from "../components/product/card";
import Loading from "../components/ui/Loading";
import {
	getProductsByIdsAction,
	getProductsPageAction,
} from "@/actions/product";
import type { PopulatedProduct } from "@/lib/Models/Product";

export async function queryProducts(
	query: URLSearchParams,
	skip?: number,
	page?: number,
) {
	const res = await getProductsPageAction({
		skip,
		page,
		brand: query.getAll("brand"),
		category: query.getAll("category"),
		name: query.get("name") || undefined,
	});
	return res;
}

export type Props = {
	products: PopulatedProduct[];
};

export default function InfProductList({ products: initProducts }: Props) {
	const endRef = React.useRef<HTMLDivElement>(null);
	const {
		items: products,
		reloadOne,
		loading,
		updateOne,
		setLoading,
		setItems: setProducts,
	} = useItemsController({
		initItems: initProducts,
		getItems: getProductsByIdsAction,
	});

	async function loadMore(query: URLSearchParams, skip: number) {
		const newProducts = await queryProducts(query, skip);
		if ("error" in newProducts) return 0;
		if (newProducts.length) setProducts((old) => [...old, ...newProducts]);
		return newProducts ? newProducts.length : 0;
	}

	useInfScroll(products, loadMore, endRef, loading);
	useSearchController({
		query: queryProducts,
		setItems: setProducts,
		setLoading,
	});


	return (
		<>
			<Loading loading={loading}>
				{products.map((product, idx) => (
					<ProductCard
						key={product.id}
						{...product}
						reload={reloadOne}
						update={updateOne}
						idx={idx}
					/>
				))}
			</Loading>
			<div className="invisible relative bottom-96" ref={endRef}>
				.
			</div>
		</>
	);
}
