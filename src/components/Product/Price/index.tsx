interface props {
	price: number
	discount: number
	className: string
}

export default function Price({ price, discount = 0, className = "" }: props) {
	return discount > 0 ? (
		<div className={`${className} text-inherit`}>
			<s className="text-gray-600 text-[.75em] decoration-accent1-700">{price}</s>
			<span className="text-accent1-700">{price - (price * discount) / 100}</span>
		</div>
	) : (
		<div className="">{price}</div>
	)
}
