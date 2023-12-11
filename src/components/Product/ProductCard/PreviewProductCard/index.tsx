import Carousel from "../../../ui/Carousel"
import Price from "../../Price"
import React from "react"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"

type Props = {
	product: Pick<PopulatedProduct, "name"|"price"|"description"> & {
		brand:string
		category:string
		images: File[]
		brandImage: string
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
			res.push(URL.createObjectURL(image))
		}
		currentImageUrls.current.push(...res)
		return res
	}, [product.images])
	return (
		<div className={`${className} overflow-hidden rounded-md bg-cyan-200 p-3`}>
			<Carousel
				className="relative h-3/5 p-1"
				brandImage={
					<img
						height={30}
						width={30}
						alt={product.brand}
						src={`/brands/${product.brandImage}`}
					/>
				}
			>
				{currentImageUrls.current.length > 0
					? currentImageUrls.current.map((img) => (
							<img
								key={Math.random()}
								className="h-full w-full absolute"
								src={img}
								alt={product.name}
							/>
					  ))
					: [
							<img
								key={Math.random()}
								className="h-full w-full absolute"
								src="/products/template.jpg"
								alt={product.name}
							/>,
					  ]}
			</Carousel>
			<div className="grid grid-cols-2">
				<h3 className="text-2xl font-bold uppercase text-accent1-400">
					{product.name}
				</h3>
				<span className="text-right text-xl font-semibold">
					{product.brand}
				</span>
				<Price
					className="text-2xl"
					price={product.price}
					discount={{discount:0,expires:new Date()}}
				/>
				<span className="justify-self-end text-lg capitalize text-gray-600">
					{product.category}
				</span>
			</div>
		</div>
	)
}
