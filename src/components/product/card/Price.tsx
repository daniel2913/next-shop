import calcPrice from "@/helpers/misc";
import React from "react";
interface Props {
	price: number;
	discount: number;
	className?: string;
}

const Price = React.memo(function Price({ price, discount, className }: Props) {
	return discount ? (
		<p className={`${className} font-bold leading-5`}>
			<s className="text-[.75em] text-foreground/60 decoration-accent">
				{price.toFixed(2)}$
			</s>
			<br />
			{calcPrice(price, discount)}$
		</p>
	) : (
		<p className={`${className} font-bold`}>{calcPrice(price, discount)}$</p>
	);
});

export default Price;
