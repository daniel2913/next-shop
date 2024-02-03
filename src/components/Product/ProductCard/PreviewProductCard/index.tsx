import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "../../../UI/carousel"
import Price from "../../Price"
import {Card, CardContent} from "@/components/UI/card"
import React from "react"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"

type Props = {
	product: Pick<PopulatedProduct, "name"|"price"|"description"> & {
		brand:string
		category:string
		images: File[]|string[]
	}
	className: string
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
			if(typeof image === "string") res.push(image)
			else res.push(URL.createObjectURL(image))
		}
		currentImageUrls.current.push(...res)
		return res
	}, [product.images])
	return (
		<Card
			className={`
				border-2 w-lgCardX h-lgCardY
			`}
		>
			<CardContent
				className="
				pt-2 px-4
				grid grid-cols-2 grid-rows-[12rem,1fr,1fr,1fr,2fr]
			"
			>
				<Carousel className="relative rounded-lg overflow-hidden h-full col-span-2">
				<CarouselContent>
				{currentImageUrls.current.length > 0
					? currentImageUrls.current.map((img,idx) => (
							<CarouselItem
								key={`${img}-${idx}`}
								className="relative h-48 ">
							<img
								className="h-full w-full absolute"
								src={img}
								alt={product.name}
							/>
							</CarouselItem>
					  ))
					: [
							<CarouselItem
								key={`template`}
								className="relative h-48 ">
							<img
								key={Math.random()}
								className="h-full w-full absolute"
								src="/products/template.jpg"
								alt={product.name}
							/>,
							</CarouselItem>
					  ]}
					</CarouselContent>
					<CarouselPrevious
						className="absolute disabled:opacity-30 opacity-50 left-4 bottom-1/2 -translate-y-1/2"
					/>
					<CarouselNext
						className="absolute disabled:opacity-30 opacity-50 right-4 bottom-1/2 -translate-y-1/2"
					/>
					<img
						className="absolute left-2 top-2 z-50 opacity-60"
						height={30}
						width={30}
						alt={product.brand}
						src={`/brands/template.jpg`}
					/>
			</Carousel>
				<div
					className="col-span-2 justify-self-center"
				/>
				<h3 className="text-2xl leading-6 text-ellipsis overflow-hidden col-span-2 font-bold uppercase text-accent1-400">
					{product.name}
				</h3>

				<span className="text-xl self-start text-ellipsis overflow-hiddenfont-semibold">
					{product.brand}
				</span>
				<span className="justify-self-end text-ellipsis overflow-hidden text-lg capitalize text-gray-600">
					{product.category}
				</span>
				<Price
					className="text-2xl"
					price={product.price}
					discount={{discount:0,expires:new Date()}}
				/>
			</CardContent>
		</Card>
	)
}
