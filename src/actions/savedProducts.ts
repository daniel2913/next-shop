"use server"

import { UserModel } from "@/lib/Models"
import { UserCache } from "@/helpers/cachedGeters"
import { ServerError, auth } from "./common"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

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

export async function clearSavedAction(){
	try {
		const user = await auth("user")
		const res = await UserModel.patch(user.id, { saved: [] })
		if (!res) throw ServerError.unknown("clearSaved after patch")
		UserCache.patch(user.name, {saved:[]})
		return
	}
	catch (error) {
		return ServerError.fromError(error).emmit()
	}
	
}

export async function getSavedAction() {
	try {
		const session = await getServerSession(authOptions)
		if (!session?.user || session.user.role!=="user") return []
		const user = await UserCache.get(session.user.name)
		if (!user) throw ServerError.hidden("UserCache Error in getSavedAction")
		return user!.saved
	}
	catch (error) {
		const serverError = ServerError.fromError(error)
		if( serverError.title==="Not Authenticated") return []
		return serverError.emmit()
	}
}
