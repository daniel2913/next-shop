"use client";
import { useSession } from "next-auth/react";
import React from "react";
import AmmountSelector from "@/components/ui/AmmountSelector";
import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/store/rtk";
import { setAmount } from "@/store/cartSlice";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/helpers/utils";

const variants = cva(
	"rounded-lg border-2 border-card-foreground",
	{
		variants: {

			size: {
				sm: "h-8 max-w-24 w-1/5 text-xl",
				md: "h-10 max-w-26 w-1/4 text-2xl",
				lg: "h-12 max-w-32 w-1/3 text-3xl",
			},
		},
		defaultVariants: {
			size: "lg"
		}
	})

type Props = {
	className?: string;
	confirm?: boolean;
	id: number;
} & VariantProps<typeof variants>

const BuyButton = React.memo(function BuyButton(props: Props) {
	const session = useSession();
	const amount = useAppSelector(s => s.cart.items[props.id]);
	const dispatch = useAppDispatch()
	if (session.data?.user?.role === "admin") {
		return null;
	}
	return amount > 0 ? (
		<AmmountSelector
			size={props.size || "lg"}
			value={amount}
			onChange={(amnt: number) =>
				dispatch(setAmount({ id: props.id, amnt }))
			}
			confirmToDelete={props.confirm}
			className={cn(variants({ size: props.size }), props.className)}
		/>
	) : (
		<Button
			type="button"
			className={cn(`text-sm font-bold uppercase`, variants({ size: props.size }), props.className)}
			onClick={() => dispatch(setAmount({ id: props.id, amnt: 1 }))}
		>
			Buy
		</Button>
	);
});

export default BuyButton;
