"use client"
import Image from "next/image"
import Price from "./Price"
import Rating from "@comps/product/Rating"
import React from "react"
import { PopulatedProduct } from "@/lib/Models/Product"
import { Card, CardContent } from "@comps/ui/Card"
import ProductCarousel from "./ProductCarousel"
import { EditProduct, ToggleFav } from "./ContextMenu"
import { useSession } from "next-auth/react"
import useModal from "@/hooks/modals/useModal"
import DetailedProduct from "@comps/modals/ProductDetailed"
import useProductStore from "@/store/productStore"
import useToast from "@/hooks/modals/useToast"
import BuyButton from "./BuyButton"

type Props = {
	product: PopulatedProduct
}

const ProductCard = React.memo(function ProductCard({ product:initProduct }: Props) {
	const session = useSession()
	const {handleResponse}= useToast()
	const {show} = useModal()
	const [product,setProduct] = React.useState(initProduct)
	const showDetails = ()=>show(<DetailedProduct product={product}/>,"Product Details",product.name)
	const updateVote = async(val:number)=>{
		const res = await useProductStore.getState().updateVote(product.id,val)
		if (handleResponse(res)) setProduct({...product,rating:res.rating,voters:res.voters,ownVote:val})
		}
	const toggleFav = async()=>{
		const res = await useProductStore.getState().toggleFav(product.id)
		if (handleResponse(res)) setProduct({...product,favourite:res})
	}
	const reload = useProductStore(state=>state.reloadSingle)
	React.useEffect(()=>{
		setProduct(state=>({...state,ownVote:initProduct.ownVote,favourite:initProduct.favourite}))
	},[initProduct.ownVote,initProduct.favourite])
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
				<ProductCarousel
					brand={
						<Image
							className="absolute top-1 left-1 rounded-full opacity-60 hover:opacity-100"
							width={30}
							height={30}
							src={`/brands/${product.brand.image}`}
							alt={product.brand.name}
						/>
					}
					discount={product.discount}
				>
					{product.images.map((img, idx) =>
						<Image
							key={`${img}-${idx}`}
							className="rounded-lg h-full"
							width={245}
							height={195}
							src={`/products/${img}`}
							alt={img}
						/>
					)}
				</ProductCarousel>
				<Rating
					id={product.id}
					onChange={(val:number)=>updateVote(val)}
					value={product.ownVote}
					rating={product.rating || 0}
					voters={product.voters}
					className="col-span-2 justify-self-center"
				/>
				<h3 className="text-2xl leading-6 text-ellipsis overflow-hidden col-span-2 font-bold uppercase text-accent1-400">
				<button onClick={showDetails} type="button" className="appearance-none">
					{product.name}
				</button>
				</h3>
				
			<span className="text-xl self-start text-ellipsis overflow-hiddenfont-semibold">
					{product.brand.name}
				</span>
				<span className="justify-self-end text-ellipsis overflow-hidden text-lg capitalize text-gray-600">
					{product.category.name}
				</span>
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
					<div className="justify-self-end">
						{
							session.data?.user?.role === "admin"
								? <EditProduct onClose={()=>reload(product.id)} product={product} />
								:
								<ToggleFav
									value={product.favourite}
									onClick={toggleFav}
								/>
						}
					</div>
				</div>
			</CardContent>
		</Card>
	)
})

export default ProductCard
