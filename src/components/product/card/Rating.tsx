"use client"
import useToast from "@/hooks/modals/useToast"
import Star from "@public/star.svg"
import { useSession } from "next-auth/react"
import React from "react"
import { cn } from "@/helpers/utils"

interface Props {
	id: number
	voters: number
	rating: number
	value: number
	onChange: (val: number) => void
	className: string
	size?: number
}

const ratings = [1, 2, 3, 4, 5]
const Rating = React.memo(function Rating({
	voters,
	value,
	onChange,
	rating,
	size = 30,
	className,
}: Props) {
	const session = useSession()
	const { show: showToast } = useToast()
	async function handleRate(i: number) {
		if (session?.data?.user?.id) onChange(i)
		else {
			showToast("Only authorized users can rate products!")
		}
	}
	return (
		<div
			className={cn(`flex flex-nowrap justify-center gap-1`, className)}
			title={
				(rating > 0 &&
					`
				${rating} from ${voters} voter${voters % 10 === 1 ? "" : "s"}`) ||
				"No Votes"
			}
		>
			{ratings.map((i) => (
				<button
					disabled={value === -1}
					type="button"
					key={`${i}-${Math.random()}`}
					onClick={() => handleRate(i)}
					className="w-1/5"
					id={`${i}`}
				>
					<Star
						width={size}
						height={size}
						key={`${i}-${Math.random()}`}
						className={`max-w-[${size}] aspect-square	h-full w-full
								${
									value === 0
									? "stroke-accent"
									: i <= rating
										? "stroke-foreground" 
										: "stroke-secondary"}
								${(i <= value && "fill-accent") || (i <= rating && "fill-foreground") || "fill-secondary"}
							`}
					/>
				</button>
			))}
		</div>
	)
})

export default Rating
