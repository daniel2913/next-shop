import calcPrice from "@/helpers/discount"
import React from "react"
interface Props {
	price: number
	discount: number
	className?: string
}

const Price = React.memo(function Price({
	price,
	discount,
	className,
}: Props) {
	return (
		discount
			?
			<div className={`${className} text-inherit flex`}>
				<p
					className="text-foreground leading-5  font-extrabold"
				>
				<s className="text-[.75em] text-secondary decoration-accent">
					{price.toFixed(2)}$
				</s>
					<br/>
					{calcPrice(price, discount)}$
				</p>
			</div>
			:
			<p className={`${className} text-foreground font-bold`}>{calcPrice(price, discount)}$</p>
	)
})

export default Price
