"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { UserModel } from "@/lib/DAL/Models"
import { UserCache } from "@/helpers/cachedGeters"

export async function addSaved(id:number){
	const session = await getServerSession(authOptions)
	if (!session?.user?.role || session.user.role!=="user") return false
	await UserModel.custom.addSaved(id,session.user.id)
	UserCache.revalidate(session.user.id.toString())
	return true
}
export async function deleteSaved(id:number){
	const session = await getServerSession(authOptions)
	if (!session?.user?.role || session.user.role!=="user") return false
	await UserModel.custom.deleteSaved(id,session.user.id)
	UserCache.revalidate(session.user.id.toString())
	return true
}
export async function clearFromSaved(id:number){
	const session = await getServerSession(authOptions)
	if (!session?.user?.role || session.user.role!=="admin") return false
	await UserModel.custom.clearAllSaved(id)
	return true
}

export async function getSaved(){
	const session = await getServerSession(authOptions)
	console.log(session)
	if (!session?.user?.role || session.user.role!=="user") return []
	const user = await UserCache.get(session.user.name)
	console.log(user?.saved)
	return user?.saved || []
}
