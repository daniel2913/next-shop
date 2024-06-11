"use client";
import useInfScroll from "@/hooks/useInfScroll";
import { useItemsController } from "@/hooks/useItemsController";
import type { PopulatedProduct } from "@/lib/Models/Product";
import React from "react";
import ProductCard from "../components/product/card";
import Loading from "../components/ui/Loading";
import { getProductsByIdsAction } from "@/actions/product";
import { useAppSelector } from "@/store/rtk";
import { error } from "@/components/ui/use-toast";
import { isValidResponse } from "@/helpers/misc";

type Props = {
	products: PopulatedProduct[];
	saved: number[];
};

export default function InfSavedList({ products: initProducts, saved: _saved }: Props) {
	const saved = useAppSelector(s => s.saved.saved)
	const endRef = React.useRef<HTMLDivElement>(null);
	const {
		items: products,
		updateOne,
		reloadOne,
		loading,
		reload,
		setItems: setProducts,
	} = useItemsController({
		initItems: initProducts,
		getItems: getProductsByIdsAction,
	});

	const updating = React.useRef(false)



	const loadMore = React.useCallback(
		async (_: URLSearchParams, skip: number, page = 20) => {
			const newProducts = await getProductsByIdsAction(
				saved.slice(skip, skip + page),
			);
			if (!isValidResponse(newProducts)) {
				error(newProducts)
				return 0
			}
			if (newProducts.length) setProducts((old) => [...old, ...newProducts]);
			return newProducts ? newProducts.length : 0;
		},
		[setProducts],
	);

	React.useEffect(() => {
		if (updating.current) return
		const loadedIds = initProducts.map(p => p.id)
		const missing = saved.filter(v => !loadedIds.includes(v))
		if (missing.length === 0) return
		updating.current = true
		getProductsByIdsAction(missing).then(r => {
			if (isValidResponse(r))
				setProducts(v => [...v, ...r])
			updating.current = false
		})
	}, [])

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
