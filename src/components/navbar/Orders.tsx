"use client";

import React from "react";
import OrderIcon from "@public/note.svg";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import NavButton from "../ui/Navbutton";
import useAction from "@/hooks/useAction";
import { getOrderNotificationsAction } from "@/actions/order";
import { useRouter } from "next/navigation";
import { LocalModal } from "../modals/Base";
import { Button } from "../ui/Button";

const Login = dynamic(() => import("@/components/modals/auth"));

type Props = {
	className: string;
};
export default function OrderMenu(props: Props) {
	const { value: notifs } = useAction(getOrderNotificationsAction, 0);
	const session = useSession();
	const [isOpen, setIsOpen] = React.useState(false)
	const router = useRouter();
	return (
		<Button
			className="flex h-full basis-0 flex-col bg-transparent p-1 text-foreground underline-offset-4 hover:bg-transparent hover:underline"
			aria-label="go to orders list"
			onClick={() =>
				session.data?.user?.role === "user"
					? router.push("/shop/orders")
					: setIsOpen(true)
			}
		>	{isOpen &&
			<LocalModal title="Authentication" isOpen={isOpen} close={() => setIsOpen(false)}>
				<Login />
			</LocalModal>
			}
			<div className="relative h-fit w-fit text-xl">
				<OrderIcon
					className="*:stroke-2:w *:fill-foreground *:stroke-foreground"
					height="25px"
					width="25px"
				/>
				{notifs ? (
					<div className="border-tan border-1 absolute -top-4 left-1/2 aspect-square w-5 overflow-hidden rounded-full bg-accent text-lg md:-right-1/2 md:-top-1/3">
						<span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
							{notifs}
						</span>
					</div>
				) : null}
			</div>
			Orders
		</Button>
	);
}
