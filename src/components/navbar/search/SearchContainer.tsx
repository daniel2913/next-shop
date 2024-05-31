"use client";

import React from "react";
import Glass from "@public/search.svg";
import NavButton from "../../ui/Navbutton";
import { LocalModal } from "@/components/modals/Base";

type Props = {
	children: React.ReactNode;
	className?: string;
};

export default function SearchContainer({ children, className }: Props) {
	const [isOpen, setIsOpen] = React.useState(false)
	return (
		<>
			<div className={`${className} hidden md:block`}>{children}</div>
			<NavButton
				className={`${className} md:hidden`}
				onClick={() => setIsOpen(v => !v)}
			>
				<Glass
					width="30px"
					height="30px"
					className="rounded-full opacity-80 *:fill-foreground *:stroke-foreground"
				/>
				Search
			</NavButton>
			{isOpen && <LocalModal title="Search" isOpen={isOpen} close={() => setIsOpen(false)}>
				{children}
			</LocalModal>
			}
		</>
	);
}
