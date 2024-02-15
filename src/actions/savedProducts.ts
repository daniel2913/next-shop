"use server"

import { UserModel } from "@/lib/Models"
import { UserCache } from "@/helpers/cachedGeters"
import { ServerError, auth } from "./common"

export async function toggleSavedAction(id: number) {
	try {
		const user = await auth("user")
		const ans = user.saved.includes(id)
		if (ans)
			user.saved = user.saved.filter(oldId => oldId !== id)
		else
			user.saved.push(id)
		const res = await UserModel.patch(user.id, { saved: user.saved })
		if (!res) throw ServerError.unknown()
		UserCache.patch(user.name, user)
		return !ans
	}
	catch (error) {
		return ServerError.fromError(error).emmit()
	}
}

export async function getSavedAction() {
	try {
		const user = await auth("user")
		return user.saved
	}
	catch (error) {
		return ServerError.fromError(error).emmit()
	}
}
