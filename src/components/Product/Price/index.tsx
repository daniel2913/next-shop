import { Discount } from "@/lib/DAL/Models/Discount"
import React from "react"
import Timer from "./Timer"
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
				{price}
			</s>
			<span className="text-accent1-700">{price - (price * discount.discount) / 100}</span>
		</div>
	) : (
		<div className="">{price}</div>
	)
})

export default Price
