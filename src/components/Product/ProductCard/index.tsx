"use client"
import BuyButton from "@/components/UI/BuyButton"
import Image from "next/image"
import Price from "../Price"
import Rating from "@/components/UI/Rating"
import React from "react"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"
import { Card, CardContent } from "@/components/UI/card"

import ProductCarousel from "../ProductCarousel"
import ProductMenu from "../ContextMenu"
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
				<React.Suspense>
				<ProductCarousel 
					brand={
						<Image
							className="absolute top-1 left-1 rounded-full opacity-60 hover:opacity-100"
							width={30}
							height={30}
							src={`/brands/${product.brand.image}`}
							alt={product.brand.name}
						/>
					}
					discount={product.discount.discount}>
					{product.images.map((img,idx)=>
						<Image
							className="rounded-lg h-full"
							width={245}
							height={195}
							src={`/products/${img}`}
							alt={img}
						/>
					)}
				</ProductCarousel>
				</React.Suspense>
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
					<React.Suspense fallback={"..."}>
					<ProductMenu
						product={product}
						className="justify-self-end"
					/>
					</React.Suspense>
				</div>
			</CardContent>
		</Card>
	)
})

export default ProductCard
