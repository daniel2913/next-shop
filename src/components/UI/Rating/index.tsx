"use client"

import useCartStore from "@/store/cartStore"
import useProductStore from "@/store/productsStore/productStore"
import Star from "@public/star.svg"
import { useSession } from "next-auth/react"
import React from "react"

interface Props {
	id: number
	className: string
}

export default function Rating({
	id,
	className,
}: Props) {
	const session = useSession()
	const {rating,voters,ownVote} = useProductStore(state=>state.products[id])
	const [loading, setLoading] = React.useState(false)
	const [status, setStatus] = React.useState(
		ownVote === 0 ? "You haven't rate this product yet!" : ""
	)
	const voteSetter = useProductStore(state=>state.updateVote)
	const setVote = (vote:number)=>voteSetter(id,vote)

	async function handleRate(i: number) {
		if (!session.data?.user?.id)
			setStatus("Only authorized users can rate products!")
		else if (ownVote === -1)
			setStatus("You can only rate products from your orders!")
		else {
			setLoading(true)
			setVote(i)
			setLoading(false)
		}
	}

	const ratings = [1, 2, 3, 4, 5]
	return (
		<div
			title={`${rating}`}
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
								i <= ownVote
									? "fill-accent1-600"
									: i <= (rating||0)
									  ? "fill-accent1-400"
									  : "fill-cyan-100"
							} 
							${
								i <= ownVote
									? "stroke-accent1-600"
									: i <= (rating||0)
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
				>{`${voters} vote${voters % 10 === 1 ? "" : "s"}`}</span>,
			]}
			<span className="w-full text-[.75em] leading-3 text-accent1-300">
				{status}
			</span>
		</div>
	)
}
