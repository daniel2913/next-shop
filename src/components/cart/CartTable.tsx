"use client";
import { getProductsByIds } from "@/actions/product";
import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/Table";
import Image from "next/image";
import useAction from "@/hooks/useAction";
import AmmountSelector from "@/components/ui/AmmountSelector";
import useResponsive from "@/hooks/useResponsive";
import type { PopulatedProduct } from "@/lib/Models/Product";
import { actions, useAppDispatch } from "@/store/rtk";
import { calcDiscount, formatPrice } from "@/helpers/misc";

type Props = {
	className?: string;
	products: PopulatedProduct[];
	interactive?: boolean;
	order: Record<string, { price: number; amount: number }>;
};

export function CartTable({ className, products, order, interactive }: Props) {
	if (products === undefined)
		products = useAction(
			() => getProductsByIds(Object.keys(order).map(Number)),
			[],
		).value;

	const totalAmount = Object.values(order).reduce(
		(sum, next) => sum + (next.amount || 0),
		0,
	);
	const totalPrice = Object.values(order).reduce(
		(total, next) => total + (next.price * next.amount || 0),
		0,
	);
	const dispatch = useAppDispatch()
	const mode = useResponsive();
	if (mode === "desktop")
		return (
			<Table
				className={`text-semibold rounded-lg text-foreground ${className} w-full table-auto`}
			>
				<TableHeader className="">
					<TableRow className=" *:p-1 *:text-center *:text-xl *:text-foreground md:*:text-xl">
						<TableHead className="w-1/12">Image</TableHead>
						<TableHead className="w-1/5">Product</TableHead>
						<TableHead className="w-1/12">Price</TableHead>
						<TableHead className="w-1/6">Amount</TableHead>
						<TableHead className="w-1/6">Total</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody className="gap-6">
					{products
						.filter(
							(product) =>
								Object.keys(order).includes(product.id.toString()) &&
								order[product.id].amount > 0,
						)
						.map((product) => (
							<TableRow
								key={product.id}
								className="w-full overflow-hidden *:text-ellipsis *:p-1 *:text-center *:text-xl *:text-foreground *:md:text-xl"
							>
								<TableCell className="flex items-center justify-center">
									<Image
										alt={product.name}
										src={`/products/${product.images[0]}`}
										width={75}
										height={60}
									/>
								</TableCell>
								<TableCell className="text-md capitalize md:text-lg">
									<h3>{product.name}</h3>
								</TableCell>
								<TableCell>${order[product.id].price}</TableCell>
								<TableCell>
									{interactive ? (
										<AmmountSelector
											value={order[product.id].amount}
											onChange={(amnt: number) => dispatch(actions.cart.setAmount({ id: product.id, amnt }))}
											className=""
										/>
									) : (
										<>{order[product.id].amount}</>
									)}
								</TableCell>
								<TableCell>
									${(order[product.id].price * order[product.id].amount).toFixed(2)}
									
								</TableCell>
							</TableRow>
						))}
				</TableBody>
				<TableFooter>
					<TableRow className="*:text-center *:text-2xl  *:font-bold  *:capitalize *:text-foreground border-t-black border-t">
						<TableCell>Total:</TableCell>
						<TableCell />
						<TableCell />
						<TableCell>{totalAmount}</TableCell>
						<TableCell>${totalPrice.toFixed(2)}</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		)
	return (
		<div className="w-full">
			{products
				.filter(
					(product) =>
						Object.keys(order).includes(product.id.toString()) &&
						order[product.id].amount > 0,
				)
				.map((product) => (
					<div
						key={product.id}
						className="mt-1 flex gap-4 border-2 border-b-black pb-1 text-xl first:mt-0"
					>
						<div className="relative flex items-center justify-center">
							<Image
								alt={product.name}
								src={`/products/${product.images[0]}`}
								width={75}
								height={60}
							/>
						</div>
						<div className="basis-4/5 text-foreground">
							<h3 className="font-semibold">{product.name}</h3>
							<div className="flex justify-start text-xl font-semibold text-foreground">
								${formatPrice(order[product.id].price)}
							</div>
							<div className="flex justify-between">
								{interactive ? (
									<AmmountSelector
										value={order[product.id].amount}
										onChange={(amnt: number) => dispatch(actions.cart.setAmount({ id: product.id, amnt }))}
										className=""
									/>
								) : (
									<span className="block w-[6ch] text-center">
										{order[product.id].amount}
									</span>
								)}
								<span className="text-xl font-bold">
									${(order[product.id].price * order[product.id].amount).toFixed(
										2,
									)}
									
								</span>
							</div>
						</div>
					</div>
				))}
			<div className="flex text-center text-xl font-bold text-foreground">
				<span className="block text-2xl w-full basis-1/4">Total:</span>
				<div className="flex w-full basis-4/5 justify-between">
					<span className="block w-[5ch]">{totalAmount}</span>
					<span>${totalPrice.toFixed(2)}</span>
				</div>
			</div>
		</div>
	)
}
