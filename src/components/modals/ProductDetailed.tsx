"use client"
import Image from "next/image"
import { PopulatedProduct } from "@/lib/Models/Product"
import ProductCarousel from "../product/ProductCarousel"
import { ScrollArea } from "../ui/ScrollArea"
import Rating from "../product/Rating"
import useProductStore from "@/store/productStore"
import useToast from "@/hooks/modals/useToast"
import React from "react"
import BuyButton from "../product/BuyButton"
import useResponsive from "@/hooks/useResponsive"

type Props = {
	product:PopulatedProduct
}

export default function DetailedProduct({product}:Props){
	const {handleResponse} = useToast()
	const mode = useResponsive()
	const [rating,setRating] = React.useState({rating:product.rating,ownVote:product.ownVote,voters:product.voters})
	const ratingSetter = useProductStore(state=>state.updateVote)
	const onRatingChange = async (val:number)=>{
		const res = await ratingSetter(product.id,val)
		if (handleResponse(res))
			setRating({rating:res.rating,voters:res.voters,ownVote:val})
	}
	if (mode ==="desktop")
		return(
		<article className="
				flex items-center
				content-center bg-background rounded-md
				p-4 gap-4 min-w-[45rem]
				w-[80vw] h-[70vh]
			"
			>
			<ProductCarousel 
				className="h-full basis-3/5"
				imageClassName="object-contain"
				images={product.images}
				discount={product.discount}
				width={450}
				height={400}
				>
			</ProductCarousel>
			<section className="flex-auto h-full basis-2/5 flex flex-col">
				<h3 className="text-5xl font-bold mb-2">{product.name}</h3>
				<Rating size={50} value={rating.ownVote} onChange={onRatingChange} id={product.id} voters={rating.voters} rating={rating.rating}
					className="justify-start w-full h-12"
				/>
				<div className="mb-2 flex justify-between text-3xl font-semibold text-slate-800">
				<h4 className="">{product.brand.name}</h4>
				<h4 className="">{product.category.name}</h4>
				</div>
				<div className="flex justify-end">
				<BuyButton id={product.id} className="w-1/3 max-w-32 h-12"/>
				</div>
				<ScrollArea className="w-full h-full overflow-y-hidden text-wrap pr-1">
					<section className="h-fit">
					<p className="text-2xl text-wrap w-full h-fit break-words">{product.description}</p>
					</section>
				</ScrollArea>
			</section>
		</article>
	)
	return(
		<ScrollArea className="h-svh w-full rounded-md text-wrap overflow-scroll">
		<article className="
				flex h-full bg-background relative flex-col items-center
				content-center rounded-md w-full
			"
			>
			<header className="flex-auto w-full bg-primary basis-3/5 sticky top-0">
			<ProductCarousel 
				className="h-[35dvh]"
				imageClassName="rounded-none w-full h-full"
				images={product.images}
				brand={product.brand.image}
				brandName={product.brand.name}
				discount={product.discount}
				fill
				>
			</ProductCarousel>
			<h3 className="text-5xl px-2 bg-primary w-full font-bold pb-2">{product.name}</h3>
			</header>
			<section className="flex-auto px-2 pb-4 basis-2/5 flex flex-col">
				<Rating size={50} value={rating.ownVote} onChange={onRatingChange} id={product.id} voters={rating.voters} rating={rating.rating}
					className="justify-start w-full h-12"
				/>
				<div className="mb-8 flex justify-between text-3xl font-semibold text-slate-800">
				<h4 className="">{product.brand.name}</h4>
				<h4 className="">{product.category.name}</h4>
				</div>
				<div className="flex justify-end">
				<BuyButton id={product.id} className="w-1/3 max-w-32 h-12"/>
				</div>
					<section>
					<p className="text-2xl text-wrap w-full h-fit break-words">{product.description}</p>
					</section>
			</section>
		</article>
		</ScrollArea>
	)
}
