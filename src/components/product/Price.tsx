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
			<div className={`${className} text-inherit flex gap-4`}>
				<p
					className="text-gray-700 font-extrabold"
				>
				<s className="text-[.75em] text-gray-600 decoration-accent">
					{price.toFixed(2)}
				</s>
					{calcPrice(price, discount)}$
				</p>
			</div>
			:
			<p className={`${className} text-gray-600 font-bold`}>{calcPrice(price, discount)}$</p>
	)
})

export default Price
