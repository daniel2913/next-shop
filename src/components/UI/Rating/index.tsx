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
	ownVote: number
	className: string
}

const ratings = [1, 2, 3, 4, 5]
const Rating = React.memo(function Rating({
	id,
	voters,
	ownVote,
	rating,
	className,
}: Props) {
	const session = useSession()
	const { show: showToast, handleResponse } = useToast()
	const voteSetter = useProductStore(state => state.updateVote)
	const setVote = (vote: number) => voteSetter(id, vote)

	async function handleRate(i: number) {
		if (!session?.data?.user?.id)
			showToast("Only authorized users can rate products!")
		else if (ownVote === -1)
			showToast("You can only rate products you bought!")
		else {
			const res = await setVote(i)
			handleResponse(res)
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
					disabled={ownVote === -1}
					type="button"
					key={`${i}-${Math.random()}`}
					onClick={() => handleRate(i)}
					className=""
					id={`${i}`}
				>
					<Star
						key={`${i}-${Math.random()}`}
						className={`
							aspect-square h-full
								${i <= ownVote
								? "fill-accent"
								: i <= (rating || 0)
									? "fill-secondary"
									: "fill-foreground"
							}
								${ownVote === 0 && "stroke-accent"}
							`}
					/>
				</button>
			)}
		</div>
	)
})

export default Rating
