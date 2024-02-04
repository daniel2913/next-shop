import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../UI/carousel";
import React from "react";
import Discount from "./Discount";

type Props = {
	children: React.ReactNode
	brand:React.ReactNode
	discount: number
}

export default function ProductCarousel({children,discount,brand}:Props) {
	return (
		<Carousel className="relative rounded-lg overflow-hidden h-full col-span-2">
			<CarouselContent className="h-full">
				{[children].flat().map((child, idx) => (
					<CarouselItem className="h-full" key={idx}>
						{child}
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious
				className="absolute disabled:opacity-30 opacity-50 left-4 bottom-1/2 -translate-y-1/2"
			/>
			<CarouselNext
				className="absolute disabled:opacity-30 opacity-50 right-4 bottom-1/2 -translate-y-1/2"
			/>
			<Discount
				className="absolute right-12 bottom-12 w-12 -rotate-[20deg] text-lg font-bold"
				discount={discount}
			/>
			{brand}
		</Carousel>
	)
}
