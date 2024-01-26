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
	const timeLeft = Number(discount.expires) - Date.now()
	return discount.discount > 0 ? (
		<div className={`${className} text-inherit`}>
			<s className="text-[.75em] text-gray-600 decoration-accent1-700">
				{price}
			</s>
			<span className="text-accent1-700">{price - (price * 15) / 100}</span>
			{timeLeft > 0 && timeLeft < 1000 * 60 * 60 * 6 ? (
				<Timer
					expires={new Date(Date.now() + 1000 * 60 * 5) /*discount.expires*/}
				/>
			) : null}
		</div>
	) : (
		<div className="">{price}</div>
	)
})

export default Price
