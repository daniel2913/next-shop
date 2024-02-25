"use client"
import Edit from "@/../public/edit.svg"
import Heart from "@/../public/heart.svg"
import DetailedProduct from "@/components/modals/ProductDetailed"
import Rating from "@/components/product/card/Rating"
import { PopulatedProduct } from "@/lib/Models/Product"
import useCartStore from "@/store/cartStore"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import React from "react"
import BuyButton from "./BuyButton"
import Price from "./Price"
import ProductCarousel from "./ProductCarousel"
import { useModalStore } from "@/store/modalStore"
import { useToastStore } from "@/store/ToastStore"

type Props = PopulatedProduct & {
	reload: (id: number) => void
	update: (id: number, part: Partial<PopulatedProduct>) => void
	idx?: number
	fold?: number
}

const ProductForm = dynamic(() => import("@/components/forms/ProductForm"))

const ProductCard = React.memo(function ProductCard(product: Props) {
	const show = useModalStore((s) => s.show)
	const isValidResponse = useToastStore((s) => s.isValidResponse)
	const vote = useCartStore((state) => state.votes[product.id])
	const setVote = useCartStore((state) => state.setVote)
	const onVoteChange = React.useCallback(
		async (val: number) => {
			const res = await setVote(product.id, val)
			if (!isValidResponse(res)) return
			product.update(product.id, res)
		},
		[product.id, setVote, isValidResponse, product.update]
	)
	const showDetails = () => show(<DetailedProduct {...product} />, product.name)

	const priority = product.idx ? product.idx < (product.fold || 10) : false

	return (
		<article className="h-lgCardY  w-lgCardX rounded-lg border-2 bg-card text-card-foreground shadow-lg">
			<main className="grid grid-cols-2 grid-rows-[12rem,1fr,1fr,1fr,2fr] px-4 pt-2">
				<ProductCarousel
					className="col-span-2 h-full p-0"
					brand={product.brand.image}
					images={product.images}
					brandName={product.brand.name}
					width={250}
					height={190}
					priority={priority}
				/>
				<Rating
					id={product.id}
					onChange={onVoteChange}
					value={vote ?? -1}
					rating={product.rating || 0}
					voters={product.voters}
					className="col-span-2 justify-self-center"
				/>
				<button
					onClick={showDetails}
					type="button"
					className="col-span-2 appearance-none"
				>
					<h3 className="w-full overflow-hidden text-ellipsis text-nowrap text-2xl font-bold uppercase leading-6 tracking-tight">
						{product.name}
					</h3>
				</button>
				<span className="overflow-hidden text-ellipsis text-nowrap text-xl font-semibold">
					{product.brand.name}
				</span>
				<span className="justify-self-end overflow-hidden text-ellipsis text-nowrap text-xl font-semibold text-muted-foreground">
					{product.category.name}
				</span>
				<Price
					className="text-2xl"
					discount={product.discount}
					price={product.price}
				/>
				<Controls {...product} />
			</main>
		</article>
	)
})

function Controls(product: Props) {
	const session = useSession()
	const show = useModalStore((s) => s.show)

	const saved = useCartStore((state) => state.saved.includes(product.id))
	const toggleSaved = useCartStore((state) => state.toggleSaved)

	return (
		<div className="flex items-center justify-end gap-2">
			<BuyButton
				className="w-full self-center justify-self-center"
				id={product.id}
			/>
			{session.data?.user?.role === "admin" ? (
				<button
					type="button"
					className={`ml-auto flex appearance-none justify-between bg-transparent p-0 hover:bg-transparent`}
					onClick={() => {
						show(<ProductForm product={product} />).then(() =>
							product.reload(product.id)
						)
					}}
				>
					<Edit
						className="*:fill-foreground *:stroke-foreground"
						width={"30px"}
						height={"30px"}
					/>
				</button>
			) : (
				<button
					type="button"
					className="group appearance-none justify-self-end bg-transparent p-0 hover:bg-transparent"
					title={saved ? "Del from Favourite" : "Add to Favoutite"}
					onClick={() => toggleSaved(product.id)}
				>
					<Heart
						className={`*:stroke-card-foreground *:stroke-1 ${
							saved
								? "fill-accent"
								: "fill-transparent group-hover:fill-accent/70"
						}
				`}
						width={"30px"}
						height={"30px"}
					/>
				</button>
			)}
		</div>
	)
}

export default ProductCard
