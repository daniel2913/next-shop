import calcPrice from "@/helpers/discount"
import React from "react"
interface props {
	price: number
	discount:number
	className?: string
}

const Price = React.memo(function Price({
	price,
	discount,
	className,
}: props) {
	return (
		<div className={`${className} text-inherit flex gap-4`}>
			<s className="text-[.75em] text-gray-600 decoration-accent1-700">
				{price.toFixed(2)}
			</s>
			<span className="text-secondary font-semibold">{calcPrice(price,discount)}</span>
		</div>
	)
})

export default Price
