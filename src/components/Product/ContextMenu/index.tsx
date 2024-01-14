"use client"
import { useSession } from "next-auth/react"
import Heart from "@/../public/heart.svg"
import Cross from "@/../public/cross.svg"
import More from "@/../public/more.svg"
import Gear from "@/../public/gear.svg"
import React from "react"

import { Popover, PopoverContent, PopoverHandler, Button } from "@/components/material-tailwind"
import useProductStore from "@/store/productsStore/productStore"

type ContextMenuProps = {
	children?: React.ReactElement[] | React.ReactElement | null
	className?: string
	icon:React.ReactElement
}
function ContextMenu({ children, className,icon }: ContextMenuProps) {
	return (
		<>
			<Popover>
				<PopoverHandler
					className={`${className || ""}`}
				>
					<button
						color="white"
					>
						{icon}
					</button>
				</PopoverHandler>
				<PopoverContent
					className="z-[60]"
				>
					<div
						className="flex flex-col gap-2"
					>
						{children || "Nothing in here..."}
					</div>
				</PopoverContent>
			</Popover>
		</>
	)
}

type ContextMenuItemProps = {
	name: string
	icon: React.ReactElement
	action: () => any
	className?: string
}
function ContextMenuItem({ name, icon, action, className }: ContextMenuItemProps) {
	return (
		<>
			<line
				className="block mx-2 bg-blue-gray-600 h-[1px] first:bg-transparent"
			/>
			<div
				className={`
				${className} group
				cursor-pointer p-1 rounded-lg w-full flex justify-between gap-2
			`}
				onClick={action}
			>
				<div
					className="w-5 aspect-square"
				>
					{icon}
				</div>
				<span
					className="text-brown-500"
				>
					{name}
				</span>

			</div>
		</>
	)
}
type Props = {
	className?: string
	id: number
	favourite: boolean
}
export default function ProductMenu({ className, id, favourite }: Props) {
	const session = useSession()
	const favToggler = useProductStore(state => state.toggleFav)
	const fav = useProductStore(state => state.products.find(prod => prod.id === id)?.favourite) ?? favourite
	const toggleFav = () => favToggler(id)
	return (
		<ContextMenu
			className={className || ""}
			icon={
					session.data?.user?.role==="admin"
					?
						<Gear
							width={"30px"}
							height={"30px"}
							className="align-middle"
						/>
					:
						<More
							width={"30px"}
							height={"30px"}
						className="align-middle"
						/>
			}
		>{	
				session.data?.user?.role!=="admin"
				?	fav
						?
						<ContextMenuItem
							name="Del from Favourite"
							action={toggleFav}
							icon={
								<Cross
									className="group-hover:stroke-accent1-500"
									width={"20px"}
									height={"20px"}
									color="black"
									stroke="black"
								/>
							}
						/>
						:
						<ContextMenuItem
							name="Add to Favourite"
							action={toggleFav}
							icon={
								<Heart
									className="group-hover:fill-accent1-300"
									width={"20px"}
									height={"20px"}
									color="black"
									stroke="black"
								/>
							}
						/>
					: null
			}
		</ContextMenu>
	)
}
