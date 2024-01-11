"use client"
import useProductStore from "@/store/productsStore/productStore"
import Star from "@public/star.svg"
import { useSession } from "next-auth/react"
import React from "react"

interface Props {
	id:number
	voters:number
	rating:number
	ownVote:number
	className: string
}

export default function Rating({
	id,
	voters: initVoters,
	ownVote: initOwnVote,
	rating: initRating,
	className,
}: Props) {
	const {voters,rating,ownVote} = useProductStore(state=>state.products.find(prod=>prod.id===id)!) || {voters: initVoters,rating: initRating,ownVote: initOwnVote}
	const session = useSession()
	const [status, setStatus] = React.useState(
		initOwnVote === 0 ? "You haven't rate this product yet!" : ""
	)
	const voteSetter = useProductStore(state=>state.updateVote)
	const setVote = (vote:number)=>voteSetter(id,vote)
	const [pending,startTransition] = React.useTransition()

	async function handleRate(i: number) {
		if (!session.data?.user?.id)
			setStatus("Only authorized users can rate products!")
		else if (ownVote === -1)
			setStatus("You can only rate products from your orders!")
		else {
			setStatus("")
			startTransition(async ()=>{
				const res = await setVote(i)
				if (!res)
					setStatus("Something went wrong...")
				else
					setStatus("Thank you for your vote!")
			})
		}
	}

	const ratings = [1, 2, 3, 4, 5]
	return (
		<div className={`${className} `}>
		<div
			title={`${rating} from ${voters} voter${voters % 10 === 1 ? "" : "s"}`}
			className={`flex flex-wrap justify-center`}
		>
			{[
				ratings.map((i) => {
					return (
						<button
							disabled={pending}
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
			]}
		</div>
			<span className="w-full text-xs text-accent1-300">
				{status}
			</span>
		</div>
	)
}
