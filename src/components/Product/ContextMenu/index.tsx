"use client"
import { useSession } from "next-auth/react"
import Heart from "@/../public/heart.svg"
import Cross from "@/../public/cross.svg"
import More from "@/../public/more.svg"
import React, { SVGProps } from "react"

import { Popover, PopoverContent, PopoverHandler, Button } from "@/components/material-tailwind"
import { addSaved, deleteSaved } from "@/actions/savedProducts"


type ContextMenuProps = {
	children?: React.ReactElement[] | React.ReactElement | null
	className?:string
}
function ContextMenu({ children,className }: ContextMenuProps) {
	return (
		<>
			<Popover>
				<PopoverHandler
					className={`${className||""}`}
				>
					<button
						color="white"
					>
					<More
						width={"20px"}
						height={"20px"}
					/>
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

type ContextMenuItemProps={
	name:string
	icon: React.ReactElement
	action:()=>any
	className?:string
}
function ContextMenuItem({name,icon,action,className}:ContextMenuItemProps){
	return(
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
type Props ={
	className?:string
	id:number
	favourite:boolean
}
export default function ProductMenu({className, id, favourite}:Props) {
	return (
		<ContextMenu
			className={className||""}
		>{
			favourite 
				? null
				:
			<ContextMenuItem
				name="Add to Favourite"
				action={()=>addSaved(id)}
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
			}
			{
				!favourite
				? null
				:
			<ContextMenuItem
				name="Del from Favourite"
				action={()=>deleteSaved(id)}
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
			}
		</ContextMenu>
	)
}
