"use client"
import React from "react"
import useCartStore from "@/store/cartStore"
import { useSession } from "next-auth/react"
import useModal from "@/hooks/modals/useModal"
import dynamic from "next/dynamic"
import CartIcon from "@public/cart.svg"
import { getUserState } from "@/actions/cart"
import useToast from "@/hooks/modals/useToast"
import useConfirm from "@/hooks/modals/useConfirm"
import Loading from "@/components/ui/Loading"
import NavButton from "../navbar/Navbutton"

const Cart = dynamic(() => import("@/components/cart/Cart"))
const Login = dynamic(() => import("@/components/modals/Login"))

type Props = {
	className: string
}

type Items = Record<string, number>

function mergeCarts(cart1: Items, cart2: Items) {
	const result = structuredClone(cart1)
	const included = Object.keys(result)
	for (const [id, amount] of Object.entries(cart2)) {
		if (included.includes(id))
			result[id] = result[id] + amount
		else
			result[id] = amount
	}
	return result
}

export function CartControl() {
	const { handleResponse } = useToast()
	const session = useSession()
	const confirm = useConfirm()
	const persist = useCartStore.persist
	const synced = React.useRef(-1)
	const updateCart = useCartStore(state => state.setItemsAndUpdate)

	React.useEffect(() => {
		async function getCache() {
			if (!persist.hasHydrated()) persist.rehydrate()
			if (session.data?.user?.role !== "user") {
				synced.current = session.data?.user?.id || -1
				return
			}
			if (!persist.hasHydrated) throw "Critical error"
			if (synced.current === session.data.user.id) return

			const state = await getUserState()
	
			if (!handleResponse(state)) return
			const {cart,saved,votes} = state
			console.log(cart,saved,votes)
			synced.current = session.data.user.id
			const localCart = useCartStore.getState().items
			const haveLocal = Object.keys(localCart).length > 0
			const haveRemote = Object.keys(cart).length > 0
			if (!haveRemote) return
			if (haveLocal && JSON.stringify(localCart) !== JSON.stringify(cart))
				if ((await confirm("Do you want to keep items from your local cart?"))){
					const merged = mergeCarts(cart, localCart)
					updateCart(merged)
					useCartStore.setState({saved,votes,items:merged})
				}
				else {
					persist.clearStorage()
					useCartStore.setState({saved,votes, items: cart })
				}
			else useCartStore.setState({saved,votes, items: cart })
		}
		getCache()
	}, [session.data?.user?.id])
	return null
}

export default function CartStatus({ className }: Props) {
	const session = useSession()
	const modal = useModal()
	const cart = useCartStore(state => state.items)
	const itemsCount = Object.values(cart).reduce((sum, next) => sum + next, 0)
	async function cartClickHandler() {
			modal.show(
				<Loading>
					{session.data?.user?.role !== "user"
						?
						<Login close={modal.close} />
						:
						<Cart />
					}
				</Loading>)
	}
	return (
		<NavButton
			className={className}
			onClick={cartClickHandler}
		>
			<div className="w-fit h-fit relative">
				<CartIcon className="*:stroke-foreground *:stroke-2" width="30px" height="30px" />
				{
					itemsCount
						?
						<div className="
						absolute overflow-hidden 
						-top-4 left-1/2 text-lg
						md:top-2/3 md:-left-1/2
						w-6 aspect-square rounded-full bg-accent border-tan border-1
					">
							<span className="absolute text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
								{itemsCount}
							</span>
						</div>
						: null
				}
			</div>
			Cart
		</NavButton>
	)
}
