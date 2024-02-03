"use client"

import useModal from "@/hooks/modals/useModal"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import Gear from "@/../public/gear.svg"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../UI/dropdown-menu"
import { Button } from "../UI/button"

const ProductForm = dynamic(() => import("@/components/forms/ProductForm"))
const BrandForm = dynamic(() => import("@/components/forms/BrandForm"))
const CategoryForm = dynamic(() => import("@/components/forms/CategoryForm"))
const DiscountForm = dynamic(() => import("@/components/forms/DiscountForm"))

type Props={
	className:string
}

export default function AdminPanel({className}:Props) {
	const session = useSession()
	const { show } = useModal()

	if (session.data?.user?.role !== "admin") return null
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger className={className}>
				<Gear height={"30px"} width={"30px"} />
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onClick={() => show(<ProductForm />)}>
					<Button>New Product</Button>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => show(<BrandForm />)}
				>
					<Button>New Brand</Button>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => show(<CategoryForm />)}
				>
					<Button>New Category</Button>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => show(<DiscountForm />)}
				>
					<Button>New Discount</Button>
				</DropdownMenuItem>
			</DropdownMenuContent>
			</DropdownMenu>
			)
}
