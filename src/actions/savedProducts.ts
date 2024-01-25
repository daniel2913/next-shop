"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { UserModel } from "@/lib/DAL/Models"
import { UserCache } from "@/helpers/cachedGeters"
import {sql} from "drizzle-orm"

export async function addSaved(id:number){
	const session = await getServerSession(authOptions)
	if (!session?.user?.role || session.user.role!=="user") return "Not Authorized"
	const res = await UserModel.raw(sql`
		UPDATE shop.users
		SET saved = array_append(saved,${id})
		WHERE id = ${session.user.id}
		RETURNING saved;
	`)
	if (res[0].saved){
		UserCache.patch(session.user.name,{saved:res[0].saved})
		return false
	}
	return "Some Error"
}
export async function deleteSaved(id:number){
	const session = await getServerSession(authOptions)
	if (!session?.user?.role || session.user.role!=="user") return "Not Authorized"
	const res = await UserModel.raw(sql`
				UPDATE shop.users
					SET saved=array_remove(saved,${id})
				WHERE
					id=${session.user.id}
				RETURNING saved
	`)
	if (res[0].saved){
		UserCache.patch(session.user.name,{saved:res[0].saved})
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
