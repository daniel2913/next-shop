"use client";
import { getProductsByIdsAction } from "@/actions/product";
import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@/components/ui/Table";
import Image from "next/image";
import useAction from "@/hooks/useAction";
import AmmountSelector from "@/components/ui/AmmountSelector";
import type { PopulatedProduct } from "@/lib/Models/Product";
import { actions, useAppDispatch } from "@/store/rtk";

type Props = {
	className?: string;
	products: PopulatedProduct[];
	interactive?: boolean;
	order: Record<string, { price: number; amount: number }>;
};

export function CartTable({ className, products, order, interactive }: Props) {
	if (products === undefined)
		products = useAction(
			() => getProductsByIdsAction(Object.keys(order).map(Number)),
			[],
		).value;

	const totalPrice = Object.values(order).reduce(
		(total, next) => total + (next.price * next.amount || 0),
		0,
	);
	const dispatch = useAppDispatch()
	return (
		<>
			<Table
				className={`text-semibold rounded-lg text-foreground ${className} w-full`}
			>
				<TableBody>
					{products
						.filter(
							(product) =>
								Object.keys(order).includes(product.id.toString()) &&
								order[product.id].amount > 0,
						)
						.map((product) => (
							<TableRow
								key={product.id}
								className="w-full overflow-hidden *:p-0 *:text-ellipsis *:text-center *:text-xs *:text-foreground *:md:text-xl"
							>
								<TableCell className="relative w-fit">
									<Image
										className="w-fit"
										alt={product.name}
										src={`/products/${product.images[0]}`}
										width={75}
										height={60}
									/>
								</TableCell>
								<TableCell className="text-md capitalize md:text-lg">
									<h3>{product.name}</h3>
								</TableCell>
								<TableCell className="text-sm md:text-2xl">${order[product.id].price}</TableCell>
								<TableCell className="p-0">
									{interactive ? (
										<AmmountSelector
											value={order[product.id].amount}
											onChange={(amnt: number) => dispatch(actions.cart.setAmount({ id: product.id, amnt }))}
											size="sm"
											className=""
										/>
									) : (
										<>{order[product.id].amount}</>
									)}
								</TableCell>
								<TableCell className="">
									${(order[product.id].price * order[product.id].amount).toFixed(2)}

								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
			<div className="text-end w-full text-xl md:text-3xl my-2">
				Total:  ${totalPrice.toFixed(2)}
			</div>
		</>
	)
}
