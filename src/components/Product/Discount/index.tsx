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
				relative aspect-square rounded-full
				bg-secondary text-center
        text-accent
				data-[lvl=none]:hidden data-[lvl=high]:bg-accent
				data-[lvl=medium]:bg-primary data-[lvl=high]:text-accent-foreground
        data-[lvl=medium]:text-primary-foreground
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
