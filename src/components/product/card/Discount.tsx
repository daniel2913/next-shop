import React from "react"

interface Props {
	className: string
	discount: number
}

const Discount = React.memo(function Discount({ discount, className }: Props) {
	if (discount === 0) return null
	return (
		<div
			className={`absolute aspect-square rounded-full bg-foreground text-center text-accent ${className}`}
		>
			<span className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 text-center text-inherit">
				{discount}%
			</span>
		</div>
	)
})
export default Discount
