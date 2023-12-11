"use server"

import { UserCache } from "@/helpers/cachedGeters"
import { OrderModel, ProductModel, UserModel } from "@/lib/DAL/Models"

type Props = {
	user: number
	id: number
	prodIds: number[]
}

export async function CompleteOrder({ user, id, prodIds }: Props) {
	const [res] = await Promise.all([
		OrderModel.patch(id, { status: "COMPLETED" }),
		ProductModel.custom.openRating(prodIds, +user),
	])
	return res
}
