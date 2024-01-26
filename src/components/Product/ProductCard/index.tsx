"use client"
import BuyButton from "@/components/ui/BuyButton"
import Carousel from "../../ui/Carousel"
import Discount from "../Discount"
import Image from "next/image"
import Price from "../Price"
import Rating from "@/components/ui/Rating"
import React from "react"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"
import { Card, CardBody } from "@/components/material-tailwind"
import ProductMenu from "../ContextMenu"
type Props = {
	className: string
	product: PopulatedProduct
}

const ProductCard = React.memo(function ProductCard({ className, product }: Props) {

	const carousel = React.useMemo(()=>
				<Carousel
					previewClassName="absolute bottom-0 left-0 right-0 h-1/5"
					carouselClassName="*:z-20"
					className="h-full relative"
					discount={
						<Discount
							className="w-12 -rotate-[20deg] text-lg font-bold"
							discount={product.discount.discount}
						/>

			}
					brandImage={
						<Image
							className="rounded-full"
							alt={product.brand.name}
							height={30}
							src={`/brands/${product.brand.image}`}
							width={30}
						/>

			}
				>
		{product.images.map((img, idx) => (
						<div
							className="w-full h-full relative"
							key={img+idx}
							>
						<Image
							priority={idx === 0 ? true : false}
							className="object-cover"
							fill
							sizes="
							(max-width:640px) 40vw
							(max-width:1024px) 10vw
							25vw
							"
							src={`/products/${img}`}
							alt={img}
						/>
						</div>
					))}
				</Carousel>
	,[product.images.toString(),product.discount.discount,product.brand.name])
	return (
		<Card
			className={`
      	${className}
				overflow-hidden rounded-md bg-cyan-200 p-2
			`}
		>
			<CardBody
				className="p-2"
			>
				{carousel}

				<div
					className="
				grid grid-cols-2
			"
				>
					<Rating
						id={product.id}
						ownVote={product.ownVote}
						rating={product.rating || 0}
						voters={product.voters}
						className="col-span-2 max-h-8 justify-self-center mb-2"
					/>
					<h3 className="text-2xl leading-6 h-12 text-ellipsis overflow-hidden col-span-2 font-bold uppercase text-accent1-400">
						{product.name}
					</h3>

					<span className="text-xl font-semibold">{product.brand.name}</span>
					<span className="justify-self-end text-lg capitalize text-gray-600">
						{product.category.name}
					</span>
					<Price
						className="text-2xl"
						discount={product.discount}
						price={product.price}
					/>
					<div className="flex gap-2 justify-end">
					<BuyButton
						className="justify-self-center h-12"
						id={product.id}
					/>
					<ProductMenu
						product={product}
						className="justify-self-end"
					/>
					</div>
				</div>
			</CardBody>
		</Card>
	)
})

export default ProductCard
