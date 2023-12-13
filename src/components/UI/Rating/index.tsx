"use client"

import useCartStore from "@/store/cartStore"
import Star from "@public/star.svg"
import { useSession } from "next-auth/react"
import React from "react"

interface Props {
	id: number
	rating: number
	voters: number
	ownVote: number
	className: string
}

export default function Rating({
	id,
	className,
	voters,
	rating,
}: Props) {
	const session = useSession()
	const prevUser = React.useRef(session.data?.user?.name)
	const [ratingState, setRatingState] = React.useState(rating)
	const [votersState, setVotersState] = React.useState(voters)
	const rated = useCartStore(state=>state.votes[id])
	const ratingSetter = useCartStore(state=>state.setVote)
	const [loading, setLoading] = React.useState(false)
	const [status, setStatus] = React.useState(
		rated === 0 ? "You haven't rate this product yet!" : ""
	)
	const setRated = React.useMemo(()=>(vote:number)=>ratingSetter(id,vote),[id,ratingSetter])
	if (session.data?.user?.name !== prevUser.current) {
		setStatus("")
		prevUser.current = session.data?.user?.name
	}

	async function handleRate(i: number) {
		if (!session.data?.user?.id)
			setStatus("Only authorized users can rate products!")
		else if (rated === -1)
			setStatus("You can only rate products from your orders!")
		else {
			setLoading(true)
			setRated(i)
			setLoading(false)
		}
	}

	const ratings = [1, 2, 3, 4, 5]
	return (
		<div
			title={`${ratingState}`}
			className={`${className} flex flex-wrap`}
		>
			{[
				ratings.map((i) => {
					return (
						<button
							disabled={loading}
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
							${
								i <= rated
									? "fill-accent1-600"
									: i <= ratingState
									  ? "fill-accent1-400"
									  : "fill-cyan-100"
							} 
							${
								i <= rated
									? "stroke-accent1-600"
									: i <= ratingState
									  ? "stroke-accent1-400"
									  : "stroke-teal-400"
							}																		
						`}
							/>
						</button>
					)
				}),
				<span
					key={`${Math.random()}`}
					className="ml-2 self-center text-sm text-gray-600"
				>{`${votersState} vote${votersState % 10 === 1 ? "" : "s"}`}</span>,
			]}
			<span className="w-full text-[.75em] leading-3 text-accent1-300">
				{status}
			</span>
		</div>
	)
}
