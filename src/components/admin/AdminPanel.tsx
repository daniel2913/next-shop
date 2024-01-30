"use client"

import useModal from "@/hooks/modals/useModal"
import { Button } from "@/components/material-tailwind"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import ContextMenu from "../UI/ContextMenu"
import Gear from "@/../public/gear.svg"
import ContextMenuItem from "../UI/ContextMenu/ContextMenuItem"

const ProductForm = dynamic(()=>import("@/components/forms/ProductForm"))
const BrandForm = dynamic(()=>import("@/components/forms/BrandForm"))
const CategoryForm = dynamic(()=>import("@/components/forms/CategoryForm"))
const DiscountForm = dynamic(()=>import("@/components/forms/DiscountForm"))

export default function AdminPanel(){
	const session = useSession()
	const {show} = useModal()

	if(session.data?.user?.role!=="admin") return null
return(
	<ContextMenu 
			icon={<Gear height={"30px"} width={"30px"}/>}
			className="flex gap-4">
		<ContextMenuItem
			action={()=>show(<ProductForm/>)}
		>
			New Product
		</ContextMenuItem>
			<ContextMenuItem
				action={()=>show(<BrandForm/>)}
			>
			New Brand
		</ContextMenuItem>
			<ContextMenuItem
				action={()=>show(<CategoryForm/>)}
			>
			New Category
		</ContextMenuItem>
			<ContextMenuItem
				action={()=>show(<DiscountForm/>)}
			>
			New Discount
		</ContextMenuItem>
	</ContextMenu>
)
}
