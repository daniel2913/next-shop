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

export default function CartStatus({ className }: Props) {
	const session = useSession();
	const router = useRouter();
	const [isOpen, setIsOpen] = React.useState(false)
	const cart = useAppSelector(s => s.cart.items)
	const itemsCount = Object.values(cart).reduce((sum, next) => sum + next, 0);

	function cartClickHandler() {
		if (session.data?.user?.role !== "user")
			setIsOpen(true)
		else if (itemsCount > 0) router.push("/shop/cart");
	}

	return (
		<>
			{isOpen && <LocalModal close={() => setIsOpen(false)} isOpen={isOpen}>
				<Login close={() => setIsOpen(false)} />
			</LocalModal>}
			<NavButton
				className={className}
				aria-label="go to cart contents list"
				onClick={cartClickHandler}
			>
				<div className="relative h-fit w-fit">
					<CartIcon
						className="*:stroke-foreground *:stroke-2"
						width="25px"
						height="25px"
					/>
					{itemsCount ? (
						<div
							className={`bg-accent border-tan border-1 absolute -top-4 left-1/2 aspect-square w-6 overflow-hidden rounded-full  text-lg md:-left-1/2 md:top-2/3
					`}
						>
							<span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
								{itemsCount}
							</span>
						</div>
					) : null}
				</div>
				Cart
			</NavButton >
		</>
	);
}
