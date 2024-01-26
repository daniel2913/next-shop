"use client"
import useToast from "@/hooks/modals/useToast"
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

const ratings = [1, 2, 3, 4, 5]
const Rating = React.memo(function Rating({
	id,
	voters,
	ownVote,
	rating,
	className,
}: Props){
	const session = useSession()
	const {show: showToast} = useToast()
	const voteSetter = useProductStore(state=>state.updateVote)
	const setVote = (vote:number)=>voteSetter(id,vote)
	const [pending,startTransition] = React.useTransition()

	async function handleRate(i: number) {
		if (!session?.data?.user?.id)
			showToast("Only authorized users can rate products!")
		else if (ownVote === -1)
			showToast("You can only rate products you bought!")
		else {
			startTransition(async ()=>{
				const res = await setVote(i)
				if (!res)
					showToast("Something went wrong...")
			})
		}
	}
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
									? "fill-accent1-600 stroke-accent1-600"
									: i <= (rating||0)
									  ? "fill-accent1-400 stroke-accent1-400"
									  : "fill-cyan-100 stroke-teal-400"
							} 
						`}
							/>
						</button>
					)
				}),
			]}
		</div>
				{
					ownVote === 0 
					? 
						<span className="w-full text-xs text-accent1-300">
								You Haven&apost Rated This Product Yet
						</span>
					: null
				}
		</div>
	)
})

export default Rating
