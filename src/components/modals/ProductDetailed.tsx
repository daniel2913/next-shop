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

type Props = {
	product:PopulatedProduct
}

export default function DetailedProduct({product}:Props){
	const {handleResponse} = useToast()
	const [rating,setRating] = React.useState({rating:product.rating,ownVote:product.ownVote,voters:product.voters})
	const ratingSetter = useProductStore(state=>state.updateVote)
	const onRatingChange = async (val:number)=>{
		const res = await ratingSetter(product.id,val)
		if (handleResponse(res))
			setRating({rating:res.rating,voters:res.voters,ownVote:val})
	}
	return(
		<div className="flex p-4 gap-8 w-[70vw] h-[80vh]">
			<ProductCarousel className="flex-auto flex-shrink-0 basis-[35vw]">
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
			<div className="flex-auto basis-1/2 flex flex-col">
				<h2 className="text-5xl font-bold mb-2">{product.name}</h2>
				<Rating size={50} value={rating.ownVote} onChange={onRatingChange} id={product.id} voters={rating.voters} rating={rating.rating}
					className="justify-start w-full h-12"
				/>
				<div className="mb-8 flex justify-between text-3xl font-semibold text-slate-800">
				<span className="">{product.brand.name}</span>
				<span className="">{product.category.name}</span>
				</div>
				<div className="flex justify-end">
				<BuyButton id={product.id} className="w-1/3 max-w-32 h-12"/>
				</div>
				<ScrollArea className="w-full text-wrap pr-1">
					<p className="text-2xl text-wrap w-full h-fit break-all">{product.description}</p>
				</ScrollArea>
			</div>
		</div>
	)
}
