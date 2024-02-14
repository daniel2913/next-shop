"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { UserModel } from "@/lib/Models"
import { UserCache } from "@/helpers/cachedGeters"
import { ServerError } from "./common"

export async function addSavedAction(id:number){
	try{
	const session = await getServerSession(authOptions)
	if (session?.user?.role!=="user") throw ServerError.notAuthed()
	const user = await UserCache.get(session.user.name)
	if (!user) throw ServerError.hidden("Bad Cache at addSavedAction")
	if (user.saved.includes(id)) return false
	user.saved.push(id)
	const res = await UserModel.patch(user.id,{saved:user.saved})
	if (res){
		UserCache.patch(session.user.name,res)
		return false
	}
	throw ServerError.unknown()
	}
	catch(error){
		return ServerError.fromError(error).emmit()
	}
}

export async function toggleSavedAction(id:number){
	try{
	const session = await getServerSession(authOptions)
	if (!session?.user?.role || session.user.role!=="user") throw ServerError.notAuthed()
	const user = await UserCache.get(session.user.name)
	if (!user) throw ServerError.hidden("Bad Cache at deleteSaved")
	const ans = user.saved.includes(id)
	if (ans) 
		user.saved = user.saved.filter(oldId=>oldId!==id)
	else
		user.saved.push(id)
	const res = await UserModel.patch(user.id,{saved:user.saved})
	if (!res) throw ServerError.unknown()
	UserCache.patch(user.name,user)
	return !ans 
	}
	catch(error){
		return ServerError.fromError(error).emmit()
	}
}

export async function deleteSavedAction(id:number){
	try{
	const session = await getServerSession(authOptions)
	if (!session?.user?.role || session.user.role!=="user") throw ServerError.notAuthed()
	const user = await UserCache.get(session.user.name)
	if (!user) throw ServerError.hidden("Bad Cache at deleteSaved")
	if (!user.saved.includes(id)) return false
	const res = await UserModel.patch(user.id,{saved:user.saved.filter(n=>n!==id)})
	if (res){
		UserCache.patch(session.user.name,res)
		return false
	}
	throw ServerError.unknown()
	}
	catch(error){
		return ServerError.fromError(error).emmit()
	}
}

export async function getSavedAction(){
	try{
	const session = await getServerSession(authOptions)
	if (!session?.user?.role || session.user.role!=="user") return []
	const user = await UserCache.get(session.user.name)
	return user?.saved || []
	}
	catch(error){
		return ServerError.fromError(error).emmit()
	}
}
