"use client";
import { createOrderAction } from "@/actions/order";
import { CartTable } from "./CartTable";
import { Button } from "@/components/ui/Button";
import { calcDiscount, isValidResponse } from "@/helpers/misc";
import type { PopulatedProduct } from "@/lib/Models/Product";
import React from "react";
import { actions, useAppDispatch, useAppSelector } from "@/store/rtk";
import { getProductsByIdsAction as getProductsByIdsAction } from "@/actions/product";
import { useRouter } from "next/navigation";
import { error } from "../ui/use-toast";

type Props = {
	products: PopulatedProduct[];
	initCart: Record<string, number>;
};

export default function Cart(props: Props) {

	const items = useAppSelector(s => s.cart.items);
	const [loadingOrder, setLoadingOrder] = React.useState(false);
	const syncing = React.useRef(false)
	const dispatch = useAppDispatch()
	const [products, setProducts] = React.useState(props.products)
	const router = useRouter()

	React.useEffect(() => {
		if (syncing.current) return
		syncing.current = true
		const missingProductIds: number[] = []
		for (const id in items) {
			if (!products.some(p => p.id === +id))
				missingProductIds.push(+id)
		}
		if (missingProductIds.length > 0) {
			getProductsByIdsAction(missingProductIds).then(r => {
				if (isValidResponse(r)) {
					setProducts(p => {
						syncing.current = false
						return p.concat(r)
					})
				}
				else error(r)
			})
		}
	}, [items])

	async function handleClick() {
		if (Object.keys(items).length === 0) return false;
		setLoadingOrder(true);
		const order: Record<number, { price: number; amount: number }> = {};
		for (const id in items) {
			const product = products.find((product) => product.id === +id);
			if (!product) {
				error({
					error: "Some of the products are no longer available",
					title: "Catalog changed",
				});
				setLoadingOrder(false);
				return;
			}
			const price = calcDiscount(product.price, product.discount);
			const amount = items[+id];
			if (!amount) continue;
			order[id] = { price, amount };
		}

		if (Object.keys(order).length !== Object.keys(items).length) {
			error({ error: "Internal Error", title: "Internal Error" });
			setLoadingOrder(false);
			return;
		}

		const res = await createOrderAction(order);

		setLoadingOrder(false);
		if (isValidResponse(res)) {
			router.push(`/shop/cart/thankyou?code=${res}`)
			dispatch(actions.cart.clearCart());
		}
		else error(res)
	}

	const order: Record<string, { price: number; amount: number }> = {};
	for (const product of products) {
		if (!items[product.id]) continue;
		order[product.id] = {
			price: calcDiscount(product.price, product.discount),
			amount: items[product.id],
		};
	}

	if (Object.keys(items).length === 0) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<h1 className="text-4xl font-bold">It's empty now :|</h1>
			</div>
		);
	}
	return (
		<main className="md:p-6 w-screen md:px-12">
			<div className="rounded-md md:border-white border-2 bg-secondary p-2">
				<CartTable
					interactive
					products={products}
					order={order}
				/>
				<div className="flex pt-2 border-transparent border-t-black border-2 justify-end gap-4">
					<Button
						variant="outline"
						className="px-1 py-0 md:py-1 text-lg  md:text-3xl"
						onClick={() => {
							router.replace("/shop/home")
							dispatch(actions.cart.clearCart())
						}}
						type="submit"
					>
						Clear
					</Button>
					<Button
						variant="outline"
						className="px-1 py-0 md:py-1 text-lg  md:text-3xl"
						disabled={loadingOrder || Object.keys(order).length === 0}
						onClick={handleClick}
						type="submit"
					>
						Order
					</Button>
				</div>
			</div>
		</main >
	);
}
