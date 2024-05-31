"use client";
import { useSession } from "next-auth/react";
import React from "react";
import AmmountSelector from "@/components/ui/AmmountSelector";
import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/store/rtk";
import { setAmount } from "@/store/cartSlice";

interface Props {
	className: string;
	confirm?: boolean;
	id: number;
}

const BuyButton = React.memo(function BuyButton(props: Props) {
	const session = useSession();
	const amount = useAppSelector(s => s.cart.items[props.id]);
	const dispatch = useAppDispatch()
	if (session.data?.user?.role === "admin") {
		return null;
	}
	return amount > 0 ? (
		<AmmountSelector
			value={amount}
			onChange={(amnt: number) =>
				dispatch(setAmount({ id: props.id, amnt }))
			}
			confirmToDelete={props.confirm}
			className={`rounded-lg border-2 border-card-foreground ${props.className}`}
		/>
	) : (
		<Button
			type="button"
			className={`rounded-lg border-2 border-none  border-card-foreground py-2 text-xl font-bold uppercase ${props.className}`}
			onClick={() => dispatch(setAmount({ id: props.id, amnt: 1 }))}
		>
			Buy
		</Button>
	);
});

export default BuyButton;
