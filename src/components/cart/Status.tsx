"use client";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import CartIcon from "@public/cart.svg";
import NavButton from "../ui/Navbutton";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/rtk";
import React from "react";
import { LocalModal } from "../modals/Base";

const Login = dynamic(() => import("@/components/modals/auth"));

type Props = {
	className: string;
};

type Items = Record<string, number>;

export function mergeCarts(cart1: Items, cart2: Items) {
	const result = structuredClone(cart1);
	const included = Object.keys(result);
	for (const [id, amount] of Object.entries(cart2)) {
		if (included.includes(id)) result[id] = result[id] + amount;
		else result[id] = amount;
	}
	return result;
}

export default function CartStatus({ className }: Props) {
	const session = useSession();
	const router = useRouter();
	const [isOpen, setIsOpen] = React.useState(false)
	const cart = useAppSelector(s => s.cart.items)
	const itemsCount = Object.values(cart).reduce((sum, next) => sum + next, 0);

	async function cartClickHandler() {
		if (session.data?.user?.role !== "user")
			setIsOpen(true)
		else if (itemsCount > 0) router.push("/shop/cart");
	}

	return (
		<NavButton
			className={className}
			aria-label="go to cart contents list"
			onClick={cartClickHandler}
		>
			{isOpen &&
				<LocalModal isOpen={isOpen} title="Authentication" close={() => setIsOpen(false)}>
					<Login close={() => setIsOpen(false)} />
				</LocalModal>
			}
			<div className="relative h-fit w-fit">
				<CartIcon
					className="*:stroke-foreground *:stroke-2"
					width="30px"
					height="30px"
				/>
				{itemsCount ? (
					<div
						className="
						border-tan border-1 
						absolute -top-4 left-1/2
						aspect-square w-6
						overflow-hidden rounded-full bg-accent text-lg md:-left-1/2 md:top-2/3
					"
					>
						<span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
							{itemsCount}
						</span>
					</div>
				) : null}
			</div>
			Cart
		</NavButton>
	);
}
