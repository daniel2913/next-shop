import BuyButton from "@/components/UI/BuyButton"
import { Carousel, CarouselItem, CarouselNext, CarouselPrevious, CarouselContent, CarouselApi } from "../../UI/carousel"
import Discount from "../Discount"
import Image from "next/image"
import Price from "../Price"
import Rating from "@/components/UI/Rating"
import React from "react"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"
import ProductMenu from "../ContextMenu"
import { Card, CardContent } from "@/components/UI/card"
type Props = {
	product: PopulatedProduct
}

const ProductCard = React.memo(function ProductCard({ className, product }: Props) {
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
						{product.images.map((img, idx) => (
							<CarouselItem
								key={`${img}-${idx}`}
								className="relative h-48 ">
								<Image
									fill
									className="object-cover"
									sizes="
							30vw
							(min-width:640px) 30vw
							(min-width:1024px) 25vw
							"
									src={`/products/${img}`}
									alt={img}
								/>
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
						discount={product.discount.discount}
					/>
					<Image
						className="absolute left-2 opacity-60 hover:opacity-100 top-2 rounded-full object-contain"
						alt={product.brand.name}
						height={30}
						width={30}
						src={`/brands/${product.brand.image}`}
					/>
				</Carousel>
				<Rating
					id={product.id}
					ownVote={product.ownVote}
					rating={product.rating || 0}
					voters={product.voters}
					className="col-span-2 justify-self-center"
				/>
				<h3 className="text-2xl leading-6 text-ellipsis overflow-hidden col-span-2 font-bold uppercase text-accent1-400">
					{product.name}
				</h3>

				<span className="text-xl self-start text-ellipsis overflow-hiddenfont-semibold">
					{product.brand.name}
				</span>
				<span className="justify-self-end text-ellipsis overflow-hidden text-lg capitalize text-gray-600">
					{product.category.name}
				</span>
				<Price
					className="text-2xl"
					discount={product.discount}
					price={product.price}
				/>
				<div className="flex gap-2 justify-end">
					<BuyButton
						className="justify-self-center self-center w-4/5 h-3/4"
						id={product.id}
					/>
					<ProductMenu
						product={product}
						className="justify-self-end"
					/>
				</div>
			</CardContent>
		</Card>
	)
})

export default ProductCard
