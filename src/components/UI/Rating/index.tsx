"use client"

import Star from "@public/star.svg"
import React from "react"

interface Props {
	rating: number
	ownRating?: number
	className: string
}

export default function Rating({ className, rating, ownRating = 0 }: Props) {
	const [rated, setRated] = React.useState(0)
	const ratings = [1, 2, 3, 4, 5]

	return (
		<div className={`${className}`}>
			{ratings.map((i) => {
				return (
					<button
						type="button"
						key={i}
						onClick={() => setRated(i)}
						className=""
						id={`${i}`}
					>
						<Star className={`
							h-full aspect-square
							${i<=rated ? "fill-accent1-600" : i<=rating ? "fill-accent1-400" : "fill-cyan-100"} 
							${i<=rated ? "stroke-accent1-600" : i<=rating ? "stroke-accent1-400" : "stroke-teal-400"}																		
						`} />
					</button>
				)
			})}
		</div>
	)
}
