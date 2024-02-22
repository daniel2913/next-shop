import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "../../ui/Carousel"
import React from "react"
import Discount from "./Discount"
import Image from "next/image"

type Props = {
	images: string[]
	brand?: string
	brandName?: string
	discount: number
	className?: string
	imageClassName?: string
	width?: number
	height?: number
	fill?: boolean
}

const ProductCarousel = React.memo(function ProductCarousel(props: Props) {
	return (
		<Carousel className={`relative ${props.className} overflow-hidden`}>
			<CarouselContent className="h-full w-full">
				{props.images.map((img, idx) => (
					<CarouselItem
						className="relative h-full"
						key={`${img}-${idx}`}
					>
						<Image
							key={`${img}-${idx}`}
							className={`h-full rounded-lg ${props.imageClassName}`}
							width={(!props.fill && props.width) || undefined}
							height={(!props.fill && props.height) || undefined}
							fill={props.fill}
							src={`/products/${img}`}
							alt={img}
						/>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious className="absolute bottom-1/2 left-4 -translate-y-1/2 opacity-50 disabled:opacity-30" />
			<CarouselNext className="absolute bottom-1/2 right-4 -translate-y-1/2 opacity-50 disabled:opacity-30" />
			<Discount
				className="absolute bottom-12 right-12 w-12 -rotate-[20deg] text-lg font-bold"
				discount={props.discount || 0}
			/>
			{props.brand ? (
				<Image
					className="absolute left-2 top-2 aspect-square rounded-full opacity-60 hover:opacity-100"
					width={30}
					height={30}
					src={`/brands/${props.brand}`}
					alt={props.brandName || ""}
				/>
			) : null}
		</Carousel>
	)
})

export default ProductCarousel
