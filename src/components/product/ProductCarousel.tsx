import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/Carousel";
import React from "react";
import Discount from "./Discount";
import Image from "next/image"

type Props = {
	images: string[],
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
			<CarouselContent className="h-full">
				{props.images.map((img, idx) =>
					<CarouselItem className="h-full relative" key={`${img}-${idx}`}>
						<Image
							key={`${img}-${idx}`}
							className={`rounded-lg h-full ${props.imageClassName}`}
							width={!props.fill && props.width || undefined}
							height={!props.fill && props.height || undefined}
							fill={props.fill}
							src={`/products/${img}`}
							alt={img}
						/>
					</CarouselItem>
				)}
			</CarouselContent>
			<CarouselPrevious
				className="absolute disabled:opacity-30 opacity-50 left-4 bottom-1/2 -translate-y-1/2"
			/>
			<CarouselNext
				className="absolute disabled:opacity-30 opacity-50 right-4 bottom-1/2 -translate-y-1/2"
			/>
			<Discount
				className="absolute right-12 bottom-12 w-12 -rotate-[20deg] text-lg font-bold"
				discount={props.discount || 0}
			/>
			{props.brand
				?<Image
					className="absolute top-1 left-1 aspect-square rounded-full opacity-60 hover:opacity-100"
					width={30}
					height={30}
					src={`/brands/${props.brand}`}
					alt={props.brandName||""}
				/>
				: null
			}
		</Carousel>
	)
})

export default ProductCarousel
