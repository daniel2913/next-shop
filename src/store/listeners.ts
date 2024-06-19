import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit"
import { cartSlice, clearCart, setAmount } from "./cartSlice"
import { type RootState } from "./rtk"
import { error } from "@/components/ui/use-toast"
import { clearSaved, toggleSaved } from "./savedSlice"
import { setVote } from "./votesSlice"

export const listenerMiddleware = createListenerMiddleware()

function isError(val: unknown): val is { error: string, title: string } {
	if (val && typeof val === "object"
		&& "error" in val && typeof val.error === "string"
		&& "title" in val && typeof val.title === "string")
		return true
	return false
}


listenerMiddleware.startListening.withTypes<RootState>()({
	matcher: isAnyOf(setAmount.settled, clearCart.settled),
	effect: (act, api) => {
		localStorage.setItem("cart", JSON.stringify(api.getState().cart.items))
	}
})

listenerMiddleware.startListening.withTypes<RootState>()({
	matcher: isAnyOf(
		setAmount.rejected, clearCart.rejected,
		clearSaved.rejected, toggleSaved.rejected,
		setVote.rejected
	),
	effect: (act, api) => {
		if ("payload" in act) {
			if (isError(act.payload)) {
				error(act.payload)
			} else {
				error({ title: "Unknown Error", error: "Unknown Error Occured" })
			}
		}
	}
})

