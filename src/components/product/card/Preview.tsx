import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "../../ui/Carousel"
import Price from "./Price"
import { Card, CardContent } from "@/components/ui/Card"
import React from "react"
import { PopulatedProduct } from "@/lib/Models/Product"

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
		<Card
			className={`
				${className} h-lgCardY w-lgCardX border-2
			`}
		>
			<CardContent className="grid grid-cols-2 grid-rows-[12rem,1fr,1fr,1fr,2fr] px-4 pt-2">
				<Carousel className="relative col-span-2 h-full overflow-hidden rounded-lg">
					<CarouselContent>
						{currentImageUrls.current.length > 0
							? currentImageUrls.current.map((img, idx) => (
									<CarouselItem
										key={`${img}-${idx}`}
										className="relative h-48 "
									>
										<img
											className="absolute h-full w-full"
											src={img}
											alt={product.name}
										/>
									</CarouselItem>
								))
							: [
									<CarouselItem
										key={`template`}
										className="relative h-48 "
									>
										<img
											key={Math.random()}
											className="absolute h-full w-full"
											src="/products/template.jpg"
											alt={product.name}
										/>
										,
									</CarouselItem>,
								]}
					</CarouselContent>
					<CarouselPrevious className="absolute bottom-1/2 left-4 -translate-y-1/2 opacity-50 disabled:opacity-30" />
					<CarouselNext className="absolute bottom-1/2 right-4 -translate-y-1/2 opacity-50 disabled:opacity-30" />
				</Carousel>
				<div className="col-span-2 justify-self-center" />
				<h3 className="text-accent1-400 col-span-2 w-full overflow-hidden text-ellipsis text-nowrap text-2xl font-bold uppercase leading-6">
					{product.name}
				</h3>

				<span className="overflow-hiddenfont-semibold self-start text-ellipsis text-xl">
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
