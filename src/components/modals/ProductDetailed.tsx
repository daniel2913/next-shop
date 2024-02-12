"use client"
import Image from "next/image"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"
import { Carousel, CarouselItem, CarouselPrevious } from "../UI/carousel"
import ProductCarousel from "../product/ProductCarousel"
import { ScrollArea } from "../UI/scroll-area"
import BuyButton from "../UI/BuyButton"
import Rating from "../UI/Rating"

type Props = {
	product:PopulatedProduct
}

export default function DetailedProduct({product}:Props){
	return(
		<div className="flex p-4 gap-8 w-[70vw] h-[80vh]">
			<ProductCarousel className="flex-auto basis-0">
				{product.images.map((img,idx)=>
						<div
							className="object-contain relative size-full"
							key={`${img}-${idx}`}
						>
						<Image
							className="rounded-lg h-full w-full"
							fill
							src={`/products/${img}`}
							alt={img}
						/>
						</div>
				)}
			</ProductCarousel>
			<div className="flex-auto basis-0 flex flex-col">
				<h2 className="text-5xl font-bold mb-2">{product.name}</h2>
				<div className="flex justify-between mb-4">
				<Rating size={50} id={product.id} voters={product.voters} rating={product.rating} ownVote={product.ownVote}
					className="justify-start h-12"
				/>
				<BuyButton id={product.id} className="w-32 h-12"/>
				</div>
				<div className="mb-8 flex justify-between text-3xl font-semibold text-slate-800">
				<span className="">{product.brand.name}</span>
				<span className="">{product.category.name}</span>
				</div>
				<ScrollArea className="w-full text-wrap pr-1">
					<p className="text-2xl text-wrap w-full h-fit break-all">{product.description}</p>
				</ScrollArea>
			</div>
		</div>
	)
}
