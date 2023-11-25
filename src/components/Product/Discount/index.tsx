import React from "react"

interface Props {
	className: string
	discount: number
}

export default function Discount({ discount, className }: Props) {
	const lvls = ["none","small", "medium", "high"]
	const style = React.useMemo(()=>lvls[(discount / 25) ^ 0],[discount])
	return (
		<div
			data-lvl = {style}
			className={`${className} 
				aspect-square rounded-full relative text-center
				bg-accent1-300 text-accent2-100
        data-[lvl=none]:hidden
				data-[lvl=medium]:bg-accent1-400 data-[lvl=medium]:text-accent2-200
				data-[lvl=high]:bg-accent1-600 data-[lvl=high]:text-accent2-400
				
            }
`}
		>
			<span
				className="
                   text-inherit absolute text-center 
                   bottom-1/2 translate-y-1/2
                   right-1/2 translate-x-1/2
                "
			>
				{discount}%
			</span>
		</div>
	)
}
