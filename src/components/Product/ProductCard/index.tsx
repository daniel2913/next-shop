"use client"
import BuyButton from "@/components/ui/BuyButton"
import Carousel from "../../ui/Carousel"
import Discount from "../Discount"
import Image from "next/image"
import Price from "../Price"
import Rating from "@/components/ui/Rating"
import useProductStore from "@/store/productsStore/productStore"
import {shallow} from "zustand/shallow"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"
type Props = {
	className: string
	id:number
}

function customCompare(oldObj:PopulatedProduct,newObj:PopulatedProduct){
	for (const key of  Object.keys(oldObj) as (keyof typeof oldObj & keyof typeof newObj)[]){
		if (key==="rating" || key==="votes" || key==="ownVote") continue
		if (oldObj[key]!==newObj[key]) return false
	}
	return true
}

export default function ProductCard({ className,id}: Props) {
	const product = useProductStore(state=>state.products[id],customCompare)
	return (
		<div
			className={`
            ${className}
			overflow-hidden rounded-md bg-cyan-200 p-3
			`}
		>
			<Carousel
				previewClassName="absolute bottom-0 left-0 right-0 h-1/5"
				className="relative h-3/5 p-1"
				discount={
					<Discount
						className="w-12 -rotate-[20deg] text-lg font-bold"
						discount={product.discount.discount}
					/>
				}
				brandImage={
					<Image
						alt={product.brand.name}
						height={30}
						src={`/brands/${product.brand.image}`}
						width={30}
					/>
				}
			>
				{product.images.map((img, idx) => (
					<Image
						priority={idx === 0 ? true : false}
						fill
						className=""
						sizes="
							(max-width:640px) 40vw
							(max-width:1024px) 20vw
							25vw
							"
						key={img}
						src={`/products/${img}`}
						alt={product.name}
					/>
				))}
			</Carousel>
			<div
				className="
				grid grid-cols-2
			"
			>
					<h3 className="text-2xl font-bold uppercase text-accent1-400">
						{product.name}
					</h3>
				<Rating
					id={product.id}
					className="col-span-2 max-h-8"
				/>

				<span className="text-xl font-semibold">{product.brand.name}</span>
				<span className="justify-self-end text-lg capitalize text-gray-600">
					{product.category.name}
				</span>
				<Price
					className="text-2xl"
					discount={product.discount}
					price={product.price}
				/>
					<BuyButton
						className="justify-self-center"
						id={product.id}
					/>
			</div>
		</div>
	)
}
