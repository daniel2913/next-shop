"use client"
import useToast from "@/hooks/modals/useToast"
import useProductStore from "@/store/productsStore/productStore"
import Star from "@public/star.svg"
import { useSession } from "next-auth/react"
import React from "react"
import { cn } from "@/lib/utils"

interface Props {
	id: number
	voters: number
	rating: number
	value: number
	onChange:(val:number)=>void
	className: string
	size?:number
}

const ratings = [1, 2, 3, 4, 5]
const Rating = React.memo(function Rating({
	voters,
	value,
	onChange,
	rating,
	size=30,
	className,
}: Props) {
	const session = useSession()
	const { show: showToast} = useToast()
	async function handleRate(i: number) {
		if (!session?.data?.user?.id)
			showToast("Only authorized users can rate products!")
		else {
			onChange(i)
		}
	}
	return (
		<div
			className={cn(
				`flex flex-wrap gap-1 justify-center`
				, className)
			}
			title={rating > 0 && `
				${rating} from ${voters} voter${voters % 10 === 1 ? "" : "s"}`
				|| "No Votes"
			}
		>
			{ratings.map((i) =>
				<button
					disabled={value===-1}
					type="button"
					key={`${i}-${Math.random()}`}
					onClick={() => handleRate(i)}
					className=""
					id={`${i}`}
				>
					<Star
						width={size}
						height={size}
						key={`${i}-${Math.random()}`}
						className={`
							aspect-square h-full
								${i <= value
								? "fill-accent"
								: i <= (rating || 0)
									? "fill-secondary"
									: "fill-foreground"
							}
								${value === 0 && "stroke-accent"}
							`}
					/>
				</button>
			)}
		</div>
	)
})

export default Rating
