import React from "react"
import Image from "next/image"
import Arrow from "@public/arrowStraight.svg"

type Props = {
	images: string[]
	brand?: string
	brandName?: string
	className?: string
	imageClassName?: string
	imageWrapperClassName?: string
	width: number
	height: number
	priority?: boolean
}

const ProductCarousel = React.memo(function ProductCarousel(props: Props) {
	const ref = React.useRef<HTMLDivElement>(null)
	const position = React.useRef(0)
	return (
		<div
			className={`relative size-full overflow-hidden rounded-lg ${props.className}`}
		>
			<button
				type="button"
				aria-label="previous image"
				className="group absolute bottom-1/2 left-0 z-10 translate-y-1/2"
				onClick={() => {
					position.current = Math.max(--position.current, 0)
					ref.current?.children[position.current].scrollIntoView({
						behavior: "smooth",
						block: "nearest",
						inline: "nearest",
					})
				}}
			>
				<Arrow
					className="-rotate-90 fill-background stroke-foreground opacity-40 group-hover:opacity-70"
					width={30}
					height={30}
				/>
			</button>
			<div
				ref={ref}
				className="relative flex h-full w-fit snap-x snap-start snap-always gap-4 overflow-x-hidden"
			>
				{props.images.map((img, idx) => (
					<div
						key={`${img}-${idx}`}
						className={`object-fit flex-shrink-0 ${props.imageWrapperClassName}`}
					>
						<Image
							priority={idx === 0 && props.priority}
							className={`h-full rounded-lg ${props.imageClassName}`}
							width={props.width}
							height={props.height}
							src={img.includes(":") ? img : `/products/${img}`}
							alt={"Product image"}
						/>
					</div>
				))}
			</div>
			<button
				type="button"
				aria-label="next image"
				className="group absolute bottom-1/2 right-0 z-10 translate-y-1/2"
				onClick={() => {
					position.current = Math.min(
						++position.current,
						props.images.length - 1
					)
					ref.current?.children[position.current].scrollIntoView({
						behavior: "smooth",
						block: "nearest",
						inline: "nearest",
					})
				}}
			>
				<Arrow
					className="rotate-90 fill-background stroke-foreground opacity-40 group-hover:opacity-70"
					width={30}
					height={30}
				/>
			</button>
			{props.brand ? (
				<Image
					className="absolute left-2 top-2 aspect-square rounded-full opacity-60 hover:opacity-100"
					width={30}
					height={30}
					src={`/brands/${props.brand}`}
					alt={props.brandName || ""}
				/>
			) : null}
		</div>
	)
})

export default ProductCarousel
