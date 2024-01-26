import React from "react"

interface Props {
	className: string
	discount: number
}

const Discount = React.memo(function Discount({ discount, className }: Props) {
	const lvls = ["none", "small", "medium", "high"]
	const style = React.useMemo(() => lvls[(discount / 25) ^ 0], [discount])
	return (
		<div
			data-lvl={style}
			className={`${className} 
				} relative aspect-square rounded-full
				bg-accent1-300 text-center
        text-accent2-100
				data-[lvl=none]:hidden data-[lvl=high]:bg-accent1-600
				data-[lvl=medium]:bg-accent1-400 data-[lvl=high]:text-accent2-400
				
            data-[lvl=medium]:text-accent2-200
`}
		>
			<span
				className="
                   text-inherit absolute bottom-1/2 
                   right-1/2 translate-x-1/2
                   translate-y-1/2 text-center
                "
			>
				{discount}%
			</span>
		</div>
	)
})
export default Discount
