"use client"

import Star from "@public/star.svg"
import { useSession } from "next-auth/react"
import React from "react"

interface Props {
	rating: number
	votes: number
	ownRating?: number
	className: string
}



export default function Rating({ className,votes, rating, ownRating = -1 }: Props) {
	const {data} = useSession()
	const [status, setStatus] = React.useState(ownRating<1 ? "You haven't rate this product yet!" : "")
	const [rated, setRated] = React.useState(0)
	const ratings = [1, 2, 3, 4, 5]
	function handleRate(i:number){
		if (!data?.user?.id) setStatus("Only authorized users can rate products!")
		//else if (ownRating === -1) setStatus("You can only rate products from your orders!")
		else {
			setStatus("Thank you for your rating!")
			setRated(i)
			fetch("/api/rating",{method:"POST",body:JSON.stringify({vote:i,voter:data?.user?.id})})
		}
	}

	return (
		<div title={`${votes} votes`} className={`${className} flex flex-wrap`}>
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
							${i<=rated ? "fill-accent1-600" : i<=rating ? "fill-accent1-400" : "fill-cyan-100"} 
							${i<=rated ? "stroke-accent1-600" : i<=rating ? "stroke-accent1-400" : "stroke-teal-400"}																		
						`} />
					</button>
				)
			}),
				<span key={`${Math.random()}`} className="text-gray-600 ml-2 self-center text-sm">{`${votes} votes`}</span>
			]
			}
			<span className="w-full text-accent1-300 text-[.75em] leading-3">{status}</span>
		</div>
	)
}
