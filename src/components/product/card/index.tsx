"use client"
import Edit from "@/../public/edit.svg"
import Heart from "@/../public/heart.svg"
import DetailedProduct from "@/components/modals/ProductDetailed"
import Rating from "@/components/product/card/Rating"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import useModal from "@/hooks/modals/useModal"
import useToast from "@/hooks/modals/useToast"
import { PopulatedProduct } from "@/lib/Models/Product"
import useCartStore from "@/store/cartStore"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import React from "react"
import { Button } from "../../ui/Button"
import BuyButton from "./BuyButton"
import Price from "./Price"
import ProductCarousel from "./ProductCarousel"

type Props = PopulatedProduct & {
	reload: (id: number) => void
	update: (id: number, part: Partial<PopulatedProduct>) => void
}

const ProductForm = dynamic(() => import("@/components/forms/ProductForm"))

const ProductCard = React.memo(function ProductCard(product: Props) {
	const { show } = useModal()
	const { handleResponse } = useToast()
	const vote = useCartStore(state => state.votes[product.id])
	const setVote = useCartStore(state => state.setVote)
	const onVoteChange = React.useCallback(
		async (val: number) => {
			const res = await setVote(product.id, val)
			if (!handleResponse(res)) return
			product.update(product.id, res)
		},
		[product.id, setVote, handleResponse, product.update]
	)
	const showDetails = () => show(<DetailedProduct {...product} />, product.name)

	return (
		<Card
			className={`
				h-lgCardY w-lgCardX border-2
			`}
		>
			<CardContent className="grid grid-cols-2 grid-rows-[12rem,1fr,1fr,1fr,2fr] px-4 pt-2">
				<CardHeader className="col-span-2 h-full p-0">
					<ProductCarousel
						className="h-full"
						discount={product.discount}
						brand={product.brand.image}
						images={product.images}
						brandName={product.brand.name}
						width={250}
						height={190}
					/>
				</CardHeader>
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
						className="w-full col-span-2 appearance-none overflow-hidden text-ellipsis text-nowrap capitalize"
					>
				<CardTitle className="text-foreground col-span-2 w-full overflow-hidden text-ellipsis text-nowrap text-2xl font-bold uppercase leading-6">
						{product.name}
				</CardTitle>
					</button>
				<h4 className="overflow-hidden w-full font-semibold self-start text-ellipsis text-xl">
					{product.brand.name}
				</h4>
				<h4 className="justify-self-end overflow-hidden text-ellipsis text-lg capitalize text-gray-600">
					{product.category.name}
				</h4>
				<Price
					className="text-2xl"
					discount={product.discount}
					price={product.price}
				/>
				<Controls {...product} />
			</CardContent>
		</Card>
	)
})

function Controls(product: Props) {
	const session = useSession()
	const modal = useModal()

	const saved = useCartStore((state) => state.saved.includes(product.id))
	const toggleSaved = useCartStore((state) => state.toggleSaved)

	return (
		<div className="flex items-center justify-end gap-2">
			<BuyButton
				className="h-3/4 w-4/5 self-center justify-self-center"
				id={product.id}
			/>
			{session.data?.user?.role === "admin" ? (
				<Button
					className={`ml-auto flex appearance-none justify-between bg-transparent p-0 hover:bg-transparent`}
					onClick={() => {
						modal
							.show(<ProductForm product={product} />)
							.then(() => product.reload(product.id))
					}}
				>
					<Edit
						className="*:fill-foreground *:stroke-foreground"
						width={"30px"}
						height={"30px"}
					/>
				</Button>
			) : (
				<Button
					className="group justify-self-end bg-transparent p-0 hover:bg-transparent"
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
				</Button>
			)}
		</div>
	)
}

export default ProductCard
