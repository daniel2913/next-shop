import { getInitStateAction } from "@/actions/user";
import { toast } from "@/components/ui/use-toast";
import { resolveCartConflict } from "@/helpers/resolveCartConflict";
import { AppStore, actions, makeStore } from "@/store/rtk";
import { useSession } from "next-auth/react";
import React from "react";
import { Provider } from "react-redux";

type StoreProps = {
	children: React.ReactNode;
	initProps: Parameters<typeof makeStore>[0]
}

export function StoreProvider(props: StoreProps) {
	const session = useSession()
	const oldId = React.useRef(session.data?.user?.id)
	const store = React.useRef<AppStore>()
	if (!store.current) {
		store.current = makeStore(props.initProps)
		const localCart = getLocalCart()
		if (localCart)
			cartConflict(props.initProps.cart.items, localCart, store.current)
	}
	React.useEffect(() => {
		if (oldId.current === session.data?.user?.id) return
		oldId.current = session.data?.user?.id
		if (!oldId.current) {
			store.current!.dispatch(actions.reset(undefined))
			localStorage.setItem("cart", "")
			return
		}
		else getInitStateAction().then(state => {
			const localCart = getLocalCart()
			store.current!.dispatch(actions.reset(state))
			if (localCart)
				cartConflict(state.cart.items, localCart, store.current!)
		})
	}, [session.data?.user?.id])
	return (
		<Provider store={store.current}>
			{props.children}
		</Provider>
	)
}


function getLocalCart() {
	if (typeof window === "undefined") return ""
	const localCartString = localStorage.getItem("cart") || ""
	let localCart: Record<number, number> | null = null
	try {
		localCart = JSON.parse(localCartString)
	} catch {
		localStorage.setItem("cart", "")
	}
	return localCart
}

async function cartConflict(remoteCart: Record<number, number>, localCart: Record<number, number>, store: AppStore) {
	await new Promise(r => setTimeout(r, 300))
	const res = resolveCartConflict(remoteCart, localCart)
	if (!res) return
	if ("mergedCarts" in res) {
		const t = toast({
			description: `There are still ${Object.keys(localCart).length} items in your local cart. Which cart would you like to use?`,
			title: "Cart Conflict",
			duration: 10000,
			actions: [
				{
					name: "Local",
					onClick: () => {
						store.dispatch(actions.cart.setCart(res.localCart))
						localStorage.setItem("cart", JSON.stringify(res.localCart))
						t.dismiss()
					}
				},
				{
					name: "Merged",
					onClick: () => {
						store.dispatch(actions.cart.setCart(res.mergedCarts))
						localStorage.setItem("cart", JSON.stringify(res.mergedCarts))
						t.dismiss()
					}
				},
				{
					name: "Remote",
					onClick: () => {
						localStorage.setItem("cart", JSON.stringify(res.remoteCart))
						t.dismiss()
					}
				},
			],
		})
	} else if (res) {
		store.dispatch(actions.cart.setCart(res))
		localStorage.setItem("cart", JSON.stringify(res))
	}
}
