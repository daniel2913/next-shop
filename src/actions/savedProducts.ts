"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { UserModel } from "@/lib/DAL/Models"
import { UserCache } from "@/helpers/cachedGeters"

export async function addSaved(id:number){
	const session = await getServerSession(authOptions)
	if (!session?.user?.role || session.user.role!=="user") return "Not Authorized"
	const user = await UserCache.get(session.user.name)
	if (!user) throw "Bad Cache"
	if (user.saved.includes(id)) return false
	user.saved.push(id)
	const res = await UserModel.patch(user.id,{saved:user.saved})
	if (res){
		UserCache.patch(session.user.name,res)
		return false
	}
	return "Some Error"
}
export async function deleteSaved(id:number){
	const session = await getServerSession(authOptions)
	if (!session?.user?.role || session.user.role!=="user") return "Not Authorized"
	const user = await UserCache.get(session.user.name)
	if (!user) throw "Bad Cache"
	if (!user.saved.includes(id)) return false
	const res = await UserModel.patch(user.id,{saved:user.saved.filter(n=>n!==id)})
	if (res){
		UserCache.patch(session.user.name,res)
		return false
	}
	return "Some Error"
}

export async function getSaved(){
	const session = await getServerSession(authOptions)
	if (!session?.user?.role || session.user.role!=="user") return []
	const user = await UserCache.get(session.user.name)
	return user?.saved || []
}
