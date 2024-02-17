"use client"
import Price from "./Price"
import Heart from "@/../public/heart.svg"
import Edit from "@/../public/edit.svg"
import Rating from "@/components/product/Rating"
import React from "react"
import { PopulatedProduct } from "@/lib/Models/Product"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import ProductCarousel from "./ProductCarousel"
import { useSession } from "next-auth/react"
import useModal from "@/hooks/modals/useModal"
import DetailedProduct from "@/components/modals/ProductDetailed"
import useProductStore from "@/store/productStore"
import useToast from "@/hooks/modals/useToast"
import BuyButton from "./BuyButton"
import { Button } from "../ui/Button"
import dynamic from "next/dynamic"

type Props = {
	product: PopulatedProduct
}

const ProductForm = dynamic(() => import("@/components/forms/ProductForm"))

const ProductCard = React.memo(function ProductCard({ product: initProduct }: Props) {
	const session = useSession()
	const { handleResponse } = useToast()
	const { show } = useModal()
	const [product, setProduct] = React.useState(initProduct)
	const showDetails = () => show(<DetailedProduct product={product} />, "Product Details", product.name)
	const reload = useProductStore(state => state.reloadSingle)
	const modal = useModal()

	const updateVote = React.useCallback(async (val: number) => {
		const res = await useProductStore.getState().updateVote(product.id, val)
		if (handleResponse(res))
			setProduct({ ...product, rating: res.rating, voters: res.voters, ownVote: val })
	}, [])

	const toggleFav = async () => {
		const res = await useProductStore.getState().toggleFav(product.id)
		if (handleResponse(res)) setProduct({ ...product, favourite: res })
	}

	React.useEffect(() => {
		setProduct(state => ({ ...state, ownVote: initProduct.ownVote, favourite: initProduct.favourite }))
	}, [initProduct.ownVote, initProduct.favourite])
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
				<CardHeader className="col-span-2 p-0 h-full">
				<ProductCarousel
					className="h-full"
					discount={product.discount}
					brand={product.brand.image}
					images={product.images}
					brandName={product.brand.name}
					width={245}
					height={195}
				>
				</ProductCarousel>
				</CardHeader>
				<Rating
					id={product.id}
					onChange={updateVote}
					value={product.ownVote}
					rating={product.rating || 0}
					voters={product.voters}
					className="col-span-2 justify-self-center"
				/>
				<CardTitle 
					className="text-2xl leading-6 w-full text-ellipsis overflow-hidden col-span-2 font-bold uppercase text-accent1-400"
					>
					<button onClick={showDetails} type="button"
						className="appearance-none text-ellipsis w-full text-nowrap overflow-hidden">
						{product.name}
					</button>
				</CardTitle>

				<h4 className="text-xl self-start text-ellipsis overflow-hiddenfont-semibold">
					{product.brand.name}
				</h4>
				<h4 className="justify-self-end text-ellipsis overflow-hidden text-lg capitalize text-gray-600">
					{product.category.name}
				</h4>
				<Price
					className="text-2xl"
					discount={product.discount}
					price={product.price}
				/>
				<div className="flex gap-2 items-center justify-end">
					<BuyButton
						className="justify-self-center self-center w-4/5 h-3/4"
						id={product.id}
					/>
						{
							session.data?.user?.role === "admin"
								?
								<Button
									className={`p-0 ml-auto bg-transparent hover:bg-transparent appearance-none flex justify-between`}
									onClick={() => {
										modal.show(
											<ProductForm product={product} />
										).then(() => reload(product.id))
									}}
								>
									< Edit
										className="hover:stroke-accent"
										width={"30px"}
										height={"30px"}
									/>
								</Button>
							:
						<Button
							className="group p-0 justify-self-end bg-transparent hover:bg-transparent"
							title={product.favourite ? "Del from Favourite" : "Add to Favoutite"}
							onClick={toggleFav}
						>
							<Heart
								className={`${product.favourite
									? "fill-accent"
									: "group-hover:fill-accent fill-transparent"
									}
				`}
								width={"30px"}
								height={"30px"}
								color="black"
								stroke="black"
							/>
						</Button>
						}
				</div>
			</CardContent>
		</Card>
	)
})

export default ProductCard
