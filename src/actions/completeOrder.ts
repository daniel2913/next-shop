"use server"

import { OrderModel } from "@/lib/DAL/Models"

export async function CompleteOrder(form: FormData) {
	const id = form.get('id')
	if (!id || Number.isNaN(+id)) return false
	const res = await OrderModel.patch(+id,{status:"COMPLETED"})
	return res
}
