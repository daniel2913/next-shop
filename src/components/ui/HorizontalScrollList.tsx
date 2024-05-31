"use client";
import React from "react";
import Arrow from "@public/arrowStraight.svg";
type Props = {
	children: React.ReactNode;
	className?: string;
	innerClassName?: string;
};
export default function HorizontalScrollList({ children, className }: Props) {
	const ref = React.useRef<HTMLDivElement>(null);
	function scroll(val: number) {
		ref.current?.scroll({
			left: ref.current.scrollLeft + val,
			behavior: "smooth",
		});
	}
	return (
		<div className="relative">
			<button
				type="button"
				aria-label="scroll left"
				onClick={() => scroll(-300)}
				className="absolute bottom-1/2 left-2 z-10 aspect-square translate-y-1/2 appearance-none rounded-full bg-background p-1 opacity-30 hover:opacity-50"
			>
				<Arrow
					className="-rotate-90 fill-foreground stroke-foreground"
					width={35}
					height={35}
				/>
			</button>
			<div
				ref={ref}
				style={{
					scrollbarWidth: "none",
				}}
				className={`flex h-fit w-full snap-x snap-center snap-always gap-4 overflow-y-hidden overflow-x-scroll px-2 *:flex-shrink-0 ${className}`}
			>
				{children}
			</div>
			<button
				type="button"
				aria-label="scroll right"
				onClick={() => scroll(300)}
				className="absolute bottom-1/2 right-2 z-10 aspect-square translate-y-1/2 appearance-none rounded-full bg-background p-1 opacity-30 hover:opacity-50"
			>
				<Arrow
					className="rotate-90 fill-foreground stroke-foreground opacity-40 group-hover:opacity-70"
					width={35}
					height={35}
				/>
			</button>
		</div>
	);
}
