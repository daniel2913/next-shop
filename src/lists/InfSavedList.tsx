"use client";
import useInfScroll from "@/hooks/useInfScroll";
import { useItemsController } from "@/hooks/useItemsController";
import type { PopulatedProduct } from "@/lib/Models/Product";
import React from "react";
import ProductCard from "../components/product/card";
import Loading from "../components/ui/Loading";
import { getProductsByIdsAction } from "@/actions/product";
import { useToastStore } from "@/store/ToastStore";
import { useAppSelector } from "@/store/rtk";

type Props = {
	products: PopulatedProduct[];
	saved: number[];
};

export default function InfSavedList({ products: initProducts, saved: _saved }: Props) {
	const saved = useAppSelector(s => s.saved.saved)// || _saved
	const endRef = React.useRef<HTMLDivElement>(null);
	const {
		items: products,
		updateOne,
		reloadOne,
		loading,
		setItems: setProducts,
	} = useItemsController({
		initItems: initProducts,
		getItems: getProductsByIdsAction,
	});
	const isValidResponse = useToastStore((s) => s.isValidResponse);

	const loadMore = React.useCallback(
		async (query: URLSearchParams, skip: number, page = 20) => {
			const newProducts = await getProductsByIdsAction(
				saved.slice(skip, skip + page),
			);
			if (!isValidResponse(newProducts)) return 0;
			if (newProducts.length) setProducts((old) => [...old, ...newProducts]);
			return newProducts ? newProducts.length : 0;
		},
		[setProducts],
	);

	useInfScroll(products, loadMore, endRef);
	const initedProducts = products || initProducts;
	return (
		<>
			<Loading loading={loading}>
				{initedProducts.map((product) => (
					<ProductCard
						key={`${product.id}`}
						{...product}
						reload={reloadOne}
						update={updateOne}
					/>
				))}
			</Loading>
			<div className="invisible relative bottom-96" ref={endRef}>
				...
			</div>
		</>
	);
}
