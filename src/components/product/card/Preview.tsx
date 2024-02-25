import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "../../ui/Carousel"
import Price from "./Price"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import React from "react"
import { PopulatedProduct } from "@/lib/Models/Product"
import Image from "next/image"
import ProductCarousel from "./ProductCarousel"
import { argv0 } from "process"
import Rating from "./Rating"

type Props = {
	product: Pick<PopulatedProduct, "name" | "price" | "description"> & {
		brand: string
		category: string
		images: File[] | string[]
	}
	className?: string
}
export default function PreviewProductCard({ product, className }: Props) {
	const currentImageUrls = React.useRef<string[]>([])
	currentImageUrls.current = React.useMemo(() => {
		for (const image of currentImageUrls.current) {
			URL.revokeObjectURL(image)
		}
		currentImageUrls.current = []
		const res: string[] = []
		if (!product.images) return res
		for (const image of product.images) {
			if (typeof image === "string") res.push(image)
			else res.push(URL.createObjectURL(image))
		}
		currentImageUrls.current.push(...res)
		return res
	}, [product.images])
	return (
		<Card className="h-lgCardY w-lgCardX border-2">
			<CardContent className="grid grid-cols-2 grid-rows-[12rem,1fr,1fr,1fr,2fr] px-4 pt-2">
				<CardHeader className="col-span-2 h-full p-0">
					<ProductCarousel
						className="h-full"
						images={
							currentImageUrls.current.length > 0
								? currentImageUrls.current
								: ["template.jpg"]
						}
						width={250}
						height={190}
					/>
				</CardHeader>
				<Rating
					id={-1}
					onChange={() => undefined}
					value={-1}
					rating={0}
					voters={0}
					className="col-span-2 justify-self-center"
				/>
				<CardTitle className="col-span-2 w-full overflow-hidden text-ellipsis text-nowrap text-2xl font-bold uppercase leading-6 text-foreground">
					{product.name}
				</CardTitle>

				<span className="w-full self-start overflow-hidden text-ellipsis text-xl font-semibold">
					{product.brand}
				</span>
				<span className="justify-self-end overflow-hidden text-ellipsis text-lg capitalize text-gray-600">
					{product.category}
				</span>
				<Price
					className="text-2xl"
					price={product.price}
					discount={0}
				/>
			</CardContent>
		</Card>
	)
}
