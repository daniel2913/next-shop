"use client";
import { createOrderAction } from "@/actions/order";
import { CartTable } from "./CartTable";
import { Button } from "@/components/ui/Button";
import calcPrice from "@/helpers/misc";
import type { PopulatedProduct } from "@/lib/Models/Product";
import React from "react";
import { useToastStore } from "@/store/ToastStore";
import { actions, useAppDispatch, useAppSelector } from "@/store/rtk";
import { cartSlice } from "@/store/cartSlice";

type Props = {
	products: PopulatedProduct[];
	initCart: Record<string, number>;
};

export default function Cart(props: Props) {
	const items = useAppSelector(s => s.cart.items);
	const [loadingOrder, setLoadingOrder] = React.useState(false);
	const isValidResponse = useToastStore((s) => s.isValidResponse);
	const error = useToastStore((s) => s.error);
	const dispatch = useAppDispatch()
	async function handleClick() {
		if (Object.keys(items).length === 0) return false;
		setLoadingOrder(true);
		const order: Record<number, { price: number; amount: number }> = {};
		for (const id in items) {
			const product = props.products.find((product) => product.id === +id);
			if (!product) {
				error(
					"Some of the products are no longer available",
					"Catalog changed",
				);
				setLoadingOrder(false);
				return;
			}
			const price = +calcPrice(product.price, product.discount);
			const amount = items[+id];
			if (!amount) continue;
			order[+id] = { price, amount };
		}
		if (Object.keys(order).length !== Object.keys(items).length) {
			error("Internal Error", "Internal Error");
			setLoadingOrder(false);
			return;
		}
		const res = await createOrderAction(order);
		setLoadingOrder(false);
		if (isValidResponse(res)) dispatch(actions.cart.clearCart());
	}
	const order: Record<string, { price: number; amount: number }> = {};
	for (const product of props.products) {
		if (!items[product.id]) continue;
		order[product.id] = {
			price: +calcPrice(product.price, product.discount),
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
		<main className="p-4">
			<div className="rounded-md bg-secondary p-2">
				<CartTable
					interactive
					className="rounded-md"
					products={props.products}
					order={order}
				/>
				<div className="flex justify-end gap-4 px-8">
					<Button
						className="px-4  text-3xl font-bold"
						onClick={() => dispatch(cartSlice.actions._clearCart())}
						type="submit"
					>
						Clear
					</Button>
					<Button
						className="px-4  text-3xl font-bold"
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
