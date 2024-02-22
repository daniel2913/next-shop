import calcPrice from "@/helpers/misc"
import React from "react"
interface Props {
	price: number
	discount: number
	className?: string
}

const Price = React.memo(function Price({ price, discount, className }: Props) {
	return discount ? (
		<div className={`${className} flex text-inherit`}>
			<p className="font-extrabold leading-5  text-foreground">
				<s className="text-[.75em] text-secondary decoration-accent">
					{price.toFixed(2)}$
				</s>
				<br />
				{calcPrice(price, discount)}$
			</p>
		</div>
	) : (
		<p className={`${className} font-bold text-foreground`}>
			{calcPrice(price, discount)}$
		</p>
	)
})

export default Price
