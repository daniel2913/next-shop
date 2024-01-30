import { Discount } from "@/lib/DAL/Models/Discount"
import React from "react"
interface props {
	price: number
	discount: Pick<Discount, "discount" | "expires">
	className?: string
}

const Price = React.memo(function Price({
	price,
	discount = { discount: 0, expires: new Date() },
	className,
}: props) {
	return (discount.discount > 0 && discount.expires>new Date()) ? (
		<div className={`${className} text-inherit`}>
			<s className="text-[.75em] text-gray-600 decoration-accent1-700">
				{price.toFixed(2)}
			</s>
			<span className="text-accent1-700">{(price - (price * discount.discount) / 100).toFixed(2)}</span>
		</div>
	) : (
		<div className="">{price.toFixed(2)}</div>
	)
})

export default Price
