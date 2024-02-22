"use client"
import React from "react"
import { cn } from "@/helpers/utils"
import {
	ArrowBigLeft,
	ArrowDownLeft,
	LucideArrowBigLeft,
	RefreshCw,
} from "lucide-react"

type Props = {
	children: React.ReactNode
	className?: string
	innerClassName?: string
}
export default function HorizontalScrollList({ children, className }: Props) {
	const ref = React.useRef<HTMLDivElement>(null)
	function scroll(val: number) {
		ref.current?.scroll({
			left: ref.current.scrollLeft + val,
			behavior: "smooth",
		})
	}
	return (
		<div className="relative">
			<button
				type="button"
				onClick={() => scroll(-300)}
				className="absolute bottom-1/2 left-2 z-10 translate-y-1/2  appearance-none"
			>
				<ArrowDownLeft
					className="rotate-45 stroke-foreground"
					width={40}
					height={40}
				/>
			</button>
			<div
				ref={ref}
				style={{
					scrollbarWidth: "none",
				}}
				className={cn(
					"flex h-fit w-full snap-proximity snap-start snap-always gap-4 overflow-y-hidden overflow-x-scroll px-2 *:flex-shrink-0",
					className
				)}
			>
				{children}
			</div>
			<button
				type="button"
				onClick={() => scroll(300)}
				className="absolute bottom-1/2 right-2 z-10 translate-y-1/2  appearance-none"
			>
				<ArrowDownLeft
					className="-rotate-[135deg] stroke-foreground"
					width={40}
					height={40}
				/>
			</button>
		</div>
	)
}
