"use client"
import { useSession } from "next-auth/react"
import Heart from "@/../public/heart.svg"
import Cross from "@/../public/cross.svg"
import More from "@/../public/more.svg"
import Gear from "@/../public/gear.svg"
import Dollar from "@/../public/dollar.svg"
import Percentile from "@/../public/percent.svg"
import Edit from "@/../public/edit.svg"
import React from "react"

import { Button, Popover, PopoverContent, PopoverHandler, Slider } from "@/components/material-tailwind"
import useProductStore from "@/store/productsStore/productStore"
import useModal from "@/hooks/modals/useModal"
import { getAllDiscounts, getGroupDiscounts, setDiscount, setExpire, toggleDiscount } from "@/actions/discount"
import { Discount } from "@/lib/DAL/Models/Discount"
import DatePicker from "@/components/ui/DatePicker"

type ContextMenuProps = {
	children: ReturnType<typeof ContextMenuItem>[]
	className?: string
	icon: React.ReactElement
}
function ContextMenu({ children, className, icon }: ContextMenuProps) {
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
	admin?:boolean
	user?:boolean
	icon: React.ReactElement
	action: () => any
	className?: string
}
function ContextMenuItem({ name, icon, action, className, admin,user }: ContextMenuItemProps) {
	const session = useSession()
	if (admin && session.data?.user?.role!=="admin") return null
	if (user && session.data?.user?.role!=="user") return null
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

function DiscountConfigRow({discount}:{discount:Discount}){
	const [dateState,setDateState] = React.useState(discount.expires.toISOString())
	return (

		<tr
			className="group grid col-span-6 grid-cols-6 grid-rows-[subgrid]"
		>
			<td>
				<Popover>
					<PopoverHandler>
						<Button>{discount.discount}</Button>
					</PopoverHandler>
					<PopoverContent
						className="z-50"
					>
						<Slider value={discountState} max={99} min={1} step={1} onChange={(e)=>setDiscountState(+e.currentTarget.value)} />
						<Button onClick={()=>setDiscount(discount.id,discountState).then(res=>res&&setDiscountState(res))}>SET</Button>
					</PopoverContent>
				</Popover>
			</td>
		</tr>
	)
}

function DiscountRow({discount,id}:{discount:Discount,id:number}){
	const [discountState,setDiscountState] = React.useState(discount.products.includes(id))
	const [disabled,setDisabled] = React.useState(false)
	return (
		<tr
			className="group grid col-span-4 grid-cols-4 grid-rows-[subgrid]"
		>
			<td
			>
				{discount.id}
			</td>
			<td
			>
				{discount.discount}
			</td>
			<td>
				{discount.expires > new Date() ? discount.expires.toLocaleString() : "Expired!"}
			</td>
			<td>
				<Button
					size="sm"
					disabled={disabled}
					onClick={()=>{
						setDisabled(true)
						toggleDiscount(discount.id,id)
							.then(res=>{
								if (res) setDiscountState(!discountState)
								setDisabled(false)
							})
					}}
				>
					{discountState?"Exclude":"Include"}
				</Button>
			</td>
		</tr>
	)
}

function DiscountModal({id}:{id:number}) {
	const [discounts,setDiscounts] = React.useState<Discount[]>([])
	React.useEffect(()=>{
		async function fetchDiscounts(){
			const t = await getAllDiscounts()
			setDiscounts(t||[])
		}
		fetchDiscounts()
		}
		,[id])
	return (
		<div>
			<table
				className="group grid grid-cols-4 item-center justify-items-center grid-rows-[subgrid]"
				>
				<tr className="col-span-4 grid grid-rows-[subgrid]">
					<th>ID</th>
					<th>Discount</th>
					<th>Expires</th>
				</tr>
				{discounts.map(discount=><DiscountRow key={discount.id} id={id} discount={discount}/>)}
			</table>	
		</div>
	)
}

function ToggleFav({ id,initFav}: { id: number, initFav: boolean }) {
	const fav = useProductStore(state => state.products.find(prod => prod.id === id)?.favourite) ?? initFav
	const favToggler = useProductStore(state => state.toggleFav)
	const toggleFav = () => favToggler(id)
	return (
		<ContextMenuItem
			user
			name= {fav ? "Del from Favourite" : "Add to Favoutite"}
			action={toggleFav}
			icon={
				fav 
					?
					<Cross
						className="group-hover:stroke-accent1-500"
						width={"20px"}
						height={"20px"}
						color="black"
						stroke="black"
					/>
					:
					<Heart
						className="group-hover:fill-accent1-300"
						width={"20px"}
						height={"20px"}
						color="black"
						stroke="black"
					/>
			}
		/>
	)
}

function Discounts({id}:{id:number}){
	const modal = useModal()
	return (
			<ContextMenuItem
				admin
				name="Discount"
				action={() => modal.show(<DiscountModal id={id} />)}
				icon=<Percentile width={"20px"} height={"20px"} />
			/>
	)
}


function EditProduct({id}:{id:number}){
	return(
		<ContextMenuItem 
			admin
			name="Set Price"
			icon={
				<Edit
					className="hove:stroke-accent1-300"
					width={"20px"}
					height={"20px"}
				/>
			}
		>
		</ContextMenuItem>
	)
}


export default function ProductMenu({ className, id, favourite }: Props) {
	const session = useSession()
	return (
		<ContextMenu
			className={className || ""}
			icon={
				session.data?.user?.role === "admin"
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
		>
			<ToggleFav id={id} initFav={favourite}/>
			<Discounts id={id}/>
		</ContextMenu>
	)
}
