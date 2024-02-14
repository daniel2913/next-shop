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
				<s className="text-[.75em] text-gray-600 decoration-accent1-700">
					{price.toFixed(2)}
				</s>
				<span className="text-secondary font-semibold">{calcPrice(price, discount)}</span>
			</div>
			:
			<span className={`${className} text-secondary font-semibold`}>{calcPrice(price, discount)}</span>
	)
})

export default Price
