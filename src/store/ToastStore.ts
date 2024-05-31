import type { ServerErrorType } from "@/hooks/useAction";
import { UnknownAction, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { create } from "zustand";
import { createTypedAsyncThunk, listenerMiddleware } from "./helper";
import { AppStore, actions } from "./rtk";
import { RejectedActionFromAsyncThunk, RejectedWithValueActionFromAsyncThunk } from "@reduxjs/toolkit/dist/matchers";

type ToastState = {
	type: "error" | "info";
	title: string;
	description: string;
	isVisible: boolean;
	info: (description: string, title?: string) => void;
	error: (description: string, title?: string) => void;
	isValidResponse: <T>(resp: T | ServerErrorType) => resp is T;
};


const initialState = {}
const tListener = listenerMiddleware.startListening.withTypes<AppStore>()({
	actionCreator: actions.votes.setVote.rejected,
	effect: (act, rej) => {
		act.meta

	}
})

function isError(val: unknown): val is { error: string, title: string } {
	if (val && typeof val === "object"
		&& "error" in val && typeof val.error === "string"
		&& "title" in val && typeof val.title === "string")
		return true
	return false

}

const errorListener = listenerMiddleware.startListening.withTypes<AppStore>()({
	matcher: isAnyOf(
		actions.cart.setAmount.rejected, actions.cart.clearCart.rejected,
		actions.saved.clearSaved.rejected, actions.saved.toggleSaved.rejected,
		actions.votes.setVote.rejected
	),
	effect: (act, rej) => {
		if ("payload" in act) {
			if (isError(act.payload)) {}
		}

	}
})

export const ErrorSlice = createSlice({
	name: "error",
	initialState,
	reducers: {
		showError: () => {
			
		}
	}

})

export const useToastStore = create<ToastState>()((set, get) => ({
	isVisible: false,
	description: "",
	title: "",
	type: "error",
	info: (description, title) => {
		set({ isVisible: true, description, title, type: "info" });
		setTimeout(() => set({ isVisible: false }), 5000);
	},
	error: (description, title) => {
		set({ isVisible: true, description, title, type: "error" });
		setTimeout(() => set({ isVisible: false }), 5000);
	},
	isValidResponse: <T>(resp: T | ServerErrorType): resp is T => {
		if (resp && typeof resp === "object" && "error" in resp) {
			set({
				title: resp.title || "Server response",
				description: resp.error,
				type: "error",
				isVisible: true,
			});
			setTimeout(() => set({ isVisible: false }), 5000);
			return false;
		}
		return true;
	},
}));
