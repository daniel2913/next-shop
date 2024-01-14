"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { DiscountModel } from "@/lib/DAL/Models"
import {sql} from "drizzle-orm"

export async function setDiscount(id:number,discount:number){
	const session = await getServerSession(authOptions)
	if (!session?.user?.role || session.user.role!=="admin") return false
	const res =  await DiscountModel.raw(sql.raw(`
		UPDATE shop.discounts
			SET discount=${discount}
		WHERE id = ${id}
		RETURNING id
	`))
	return res.length===0
}

export async function addDiscount(type:"products"|"categories"|"brands",id:number,targId:number){
	if (type !== "products" && type !== "categories" && type !== "brands") return false
	const session = await getServerSession(authOptions)
	if (!session?.user?.role || session.user.role!=="admin") return false
	const res =  await DiscountModel.raw(sql.raw(`
		UPDATE shop.discounts
			SET ${type}=array_append(${type},${targId})
		WHERE 
				id = ${id}
			AND
				NOT ${id} = ANY(${type})
		RETURNING id;
	`))
	return res.length===0
}

export async function setExpire(id:number,expires:Date){
	const session = await getServerSession(authOptions)
	if (!session?.user?.role || session.user.role!=="admin") return false
	const res =  await DiscountModel.raw(sql.raw(`
		UPDATE shop.discounts
			SET expires=timestamp '${expires.toUTCString()}'
		WHERE 
				id = ${id}
		RETURNING id;
	`))
	return res.length===0
}


