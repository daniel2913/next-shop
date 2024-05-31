"use client";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;
const NavButton = React.forwardRef(function NavButton(
	props: Props,
	ref: React.ForwardedRef<HTMLButtonElement>,
) {
	return (
		<button
			type="button"
			{...props}
			ref={ref}
			className={`relative flex h-full flex-col items-center justify-center bg-transparent p-0 font-semibold text-foreground transition-colors hover:bg-transparent hover:drop-shadow-lg md:flex-row md:gap-2 ${props.className}`}
		>
			{props.children}
		</button>
	);
});

export default NavButton;
