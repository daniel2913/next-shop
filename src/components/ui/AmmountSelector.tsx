"use client";
import React from "react";
import { ModalContext } from "@/providers/ModalProvider";
import ModalConfirm from "../modals/Confirm";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/helpers/utils";

const variants = cva("", {
	variants: {
		size: {
			sm: "text-xl",
			md: "text-2xl",
			lg: "text-3xl",
		},
	},
	defaultVariants: {
		size: "md"
	}
})

type Props = {
	className: string;
	value: number;
	onChange: (val: number) => void;
	confirmToDelete?: boolean;
} & VariantProps<typeof variants>

export default function AmmountSelector(props: Props) {
	const show = React.useContext(ModalContext)
	const confirm = () => show({
		title: "Are you sure",
		children: (close: (val: boolean) => void) => <ModalConfirm message="Are you sure you want to delete this item from your cart?" resolver={close} />
	})
	function clickHandler(newAmount: number) {
		if (newAmount <= 0) {
			if (props.confirmToDelete)
				confirm().then((ans) => {
					return ans ? props.onChange(0) : false;
				});
			else return props.onChange(0);
		} else props.onChange(newAmount);
	}
	//`flex justify-between font-semibold ${className}`}>
	return (
		<div className={cn("flex justify-between font-semibold", variants({ size: props.size }))}>
			<button
				type="button"
				className="mr-auto flex flex-grow items-center justify-center leading-4 text-inherit"
				onClick={() => clickHandler(props.value - 1)}
			>
				-
			</button>
			<span className="w-[3ch] grow-0 basis-8 overflow-clip text-center  font-bold text-foreground">
				{props.value}
			</span>
			<button
				type="button"
				className="ml-auto flex flex-grow items-center justify-center leading-4 text-inherit "
				onClick={() => clickHandler(props.value + 1)}
			>
				+
			</button>
		</div>
	);
}
