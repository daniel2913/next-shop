"use client"

import useModal from "@/hooks/modals/useModal"
import { Button } from "@/components/material-tailwind"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import ContextMenu from "../ui/ContextMenu"
import Gear from "@/../public/gear.svg"
import ContextMenuItem from "../ui/ContextMenu/ContextMenuItem"

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
		<ContextMenuItem>
		<Button
			size="sm"
			onClick={()=>show(<ProductForm/>)}
		>
			New Product
		</Button>
		</ContextMenuItem>
			<ContextMenuItem>
		<Button
			size="sm"
			onClick={()=>show(<BrandForm/>)}
		>
			New Brand
		</Button>
		</ContextMenuItem>
			<ContextMenuItem>
		<Button
			size="sm"
			onClick={()=>show(<CategoryForm/>)}
		>
			New Category
		</Button>
		</ContextMenuItem>
			<ContextMenuItem>
		<Button
			size="sm"
			onClick={()=>show(<DiscountForm/>)}
		>
			New Discount
		</Button>
		</ContextMenuItem>
	</ContextMenu>
)
}
