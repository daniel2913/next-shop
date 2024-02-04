"use client"
import { useSession } from "next-auth/react"
import Heart from "@/../public/heart.svg"
import Cross from "@/../public/cross.svg"
import More from "@/../public/more.svg"
import Gear from "@/../public/gear.svg"
import Edit from "@/../public/edit.svg"
import React, { Suspense } from "react"
import useProductStore from "@/store/productsStore/productStore"
import useModal from "@/hooks/modals/useModal"
import dynamic from "next/dynamic"
import { PopulatedProduct } from "@/lib/DAL/Models/Product"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/UI/dropdown-menu"
import { Button } from "@/components/UI/button"

const ProductForm = dynamic(() => import("@/components/forms/ProductForm"))

function ToggleFav({ id, initFav }: { id: number, initFav: boolean }) {
	const fav = useProductStore(state => state.products.find(prod => prod.id === id)?.favourite) ?? initFav
	const favToggler = useProductStore(state => state.toggleFav)
	const toggleFav = () => favToggler(id)
	return (
		<Button
			onClick={toggleFav}
		>
			{
				fav
					?<Cross
						className="group-hover:stroke-accent1-500"
						width={"20px"}
						height={"20px"}
						color="black"
						stroke="black"
					/>
					:<Heart
						className="group-hover:fill-accent1-300"
						width={"20px"}
						height={"20px"}
						color="black"
						stroke="black"
					/>
			}
			{fav ? "Del from Favourite" : "Add to Favoutite"}
		</Button>
	)
}

function EditProduct({ product }: { product: PopulatedProduct }) {
	const modal = useModal()
	const reloader = useProductStore(state => state.reloadSingle)
	const reload = () => reloader(product.id)
	return (
		<Button
			className="appearance-none w-full flex justify-between"
			onClick={() => {
				modal.show(
						<ProductForm product={product} />
				).then(() => { reload() })
			}}
		>
				< Edit
					className="hove:stroke-accent1-300"
					width={"20px"}
					height={"20px"}
				/>
			Edit
		</Button>
	)
}

type Props = {
	className?: string
	product: PopulatedProduct
}

export default function ProductMenu({ className, product }: Props) {
	const session = useSession()
	const role = session.data?.user?.role || "user"
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger>
				{role === "admin"
					?
					<Gear
						width={"25px"}
						height={"25px"}
						className="align-middle"
					/>
					:
					<More
						width={"25px"}
						height={"25px"}
						className="align-middle"
					/>
				}
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{role === "admin"
					? <>
						<DropdownMenuItem key="edit">
							<EditProduct  product={product} />
						</DropdownMenuItem>,
					</>
					: <>
						<DropdownMenuItem key="fav">
							<ToggleFav id={product.id} initFav={product.favourite} />
						</DropdownMenuItem>,
					</>
				}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
