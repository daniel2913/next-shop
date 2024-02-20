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
import useToast from "@/hooks/modals/useToast"
import BuyButton from "./BuyButton"
import { Button } from "../ui/Button"
import dynamic from "next/dynamic"
import useCartStore from "@/store/cartStore"

type Props = PopulatedProduct & {
	reload:(id:number)=>void
	update:(id:number,part:Partial<PopulatedProduct>)=>void
}

const ProductForm = dynamic(() => import("@/components/forms/ProductForm"))

const ProductCard = React.memo(function ProductCard(product: Props) {
	const { show } = useModal()
	const {handleResponse} = useToast()
	const vote = useCartStore(state=>state.votes[product.id]) ?? -1
	const setVote = useCartStore(state=>state.setVote)
	const onVoteChange = React.useCallback(async (val:number)=>{
		const res = await setVote(product.id,val)
		if (!handleResponse(res)) return
		product.update(product.id,res)
		
	},[product.id,setVote])
	const showDetails = () => show(<DetailedProduct {...product}/>, "Product Details", product.name)

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
					onChange={onVoteChange}
					value={vote}
					rating={product.rating || 0}
					voters={product.voters}
					className="col-span-2 justify-self-center"
				/>
				<CardTitle 
					className="text-2xl leading-6 w-full text-ellipsis overflow-hidden col-span-2 font-bold uppercase text-accent1-400"
					>
					<button onClick={showDetails} type="button"
						className="appearance-none capitalize text-ellipsis w-full text-nowrap overflow-hidden">
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
				<Controls {...product}/>
			</CardContent>
		</Card>
	)
})

function Controls(product:Props){
	const { handleResponse } = useToast()
	const session = useSession()
	const modal = useModal()

	const saved = useCartStore(state=>state.saved.includes(product.id))
	const toggleSaved = useCartStore(state=>state.toggleSaved)

	return(
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
										).then(() => product.reload(product.id))
									}}
								>
									< Edit
										className="*:stroke-foreground *:fill-foreground"
										width={"30px"}
										height={"30px"}
									/>
								</Button>
							:
						<Button
							className="group p-0 justify-self-end bg-transparent hover:bg-transparent"
							title={saved ? "Del from Favourite" : "Add to Favoutite"}
							onClick={()=>toggleSaved(product.id)}
						>
							<Heart
								className={`*:stroke-card-foreground *:stroke-1 ${saved
									? "fill-accent"
									: "group-hover:fill-accent/70 fill-transparent"
									}
				`}
								width={"30px"}
								height={"30px"}
							/>
						</Button>
						}
				</div>

	)
}

export default ProductCard
