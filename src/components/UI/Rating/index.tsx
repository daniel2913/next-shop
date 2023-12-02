"use client"

import useError from "@/hooks/modals/useError"
import Star from "@public/star.svg"
import { useSession } from "next-auth/react"
import React from "react"

interface Props {
	id:number,
	rating: number
	voters: number
	ownVote: number
	className: string
}



export default function Rating({id, className,voters, rating, ownVote = -1 }: Props) {
	const session = useSession()
	const prevUser = React.useRef(session.data?.user?.name)
	const [ratingState, setRatingState] = React.useState(rating)
	const [votersState, setVotersState] = React.useState(voters)
	const [status, setStatus] = React.useState(ownVote===0 ? "You haven't rate this product yet!" : "")
	const [rated, setRated] = React.useState(ownVote)
	const ratings = [1, 2, 3, 4, 5]
	if (session.data?.user?.name !== prevUser.current){
		setStatus('')
		prevUser.current = session.data?.user?.name
	}
	React.useEffect(()=>setRated(ownVote),[ownVote,setRated])
	
	async function handleRate(i:number){
		if (!session.data?.user?.id) setStatus("Only authorized users can rate products!")
		else if (ownVote === -1) setStatus("You can only rate products from your orders!")
		else {
			setStatus("Thank you for your rating!")
			const oldRating = rated
			setRated(i)
			const res = await fetch("/api/product/rating",{method:"POST",body:JSON.stringify({vote:i,id})})
			if (res.status===200){
					const {voters,rating} = await res.json()
					console.log(voters,rating)
					setRatingState(rating)
					setVotersState(voters)
				return true
			}
			setRated(oldRating)
			setStatus(res.status.toString())
		}
	}

	return (
		<div title={`${ratingState}`} className={`${className} flex flex-wrap`}>
			{[ratings.map((i) => {
				return (
					<button
						type="button"
						key={`${i}-${Math.random()}`}
						onClick={() => handleRate(i)}
						className=""
						id={`${i}`}
					>
						<Star 
							key={`${i}-${Math.random()}`}
							className={`
							h-full aspect-square
							${i<=rated ? "fill-accent1-600" : i<=ratingState ? "fill-accent1-400" : "fill-cyan-100"} 
							${i<=rated ? "stroke-accent1-600" : i<=ratingState ? "stroke-accent1-400" : "stroke-teal-400"}																		
						`} />
					</button>
				)
			}),
				<span key={`${Math.random()}`} className="text-gray-600 ml-2 self-center text-sm">{`${votersState} vote${votersState % 10 === 1 ? '' : 's'}`}</span>
			]
			}
			<span className="w-full text-accent1-300 text-[.75em] leading-3">{status}</span>
		</div>
	)
}
