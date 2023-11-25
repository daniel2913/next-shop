import Carousel from "../../../ui/Carousel"
import Price from "../../Price"
import Discount from "../../Discount"
import React from "react"
import { Product } from "@/lib/DAL/Models"

type props = {
	product: Omit<Product, "images"> & {
		images: File[]
		brandImage: string
	}
	className: string
}

export default function PreviewProductCard({ product, className }: props) {
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
		<div
			className={`${className} rounded-md p-3 bg-cyan-200 overflow-hidden`}
		>
			<Carousel
				className="h-3/5 p-1 relative"
				discount={
					<Discount
						className="w-12 text-lg font-bold -rotate-[20deg]"
						discount={product.discount || 0}
					/>
				}
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
						<img className="h-[200%] w-full" src={img} alt={product.name} />
					))
					: [<img className="" src="/products/template.jpg" alt={product.name} />]}
			</Carousel>
			<div
				className="grid grid-cols-2"
			>
				<h3 className="text-accent1-400 text-2xl uppercase font-bold">
					{product.name}
				</h3>
				<span className="text-xl text-right font-semibold">{product.brand}</span>
				<Price
					className="text-2xl"
					price={product.price || 200}
					discount={product.discount || 0}
				/>
				<span className="text-lg capitalize justify-self-end text-gray-600">
					{product.category}
				</span>

			</div>
		</div>
	)
}
