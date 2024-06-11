"use server";

import { type Order, OrderModel, UserModel } from "@/lib/Models/index";
import { inArray, } from "drizzle-orm";
import {
	ServerError,
	modelGeneralAction,
} from "./common";
import { auth } from "./auth";
import { getProductsByIds } from "./product";
import type { PopulatedProduct } from "@/lib/Models/Product";
import { toArray } from "@/helpers/misc";
import { UserCache } from "@/helpers/cache";

export type PopulatedOrder = {
	order: Order;
	products: PopulatedProduct[];
};

export async function getOrderByCodeAction(code: string) {
	try {
		const order = await OrderModel.findOne({ code })
		if (!order) throw ServerError.notFound()
		return (await populateOrders([order]))[0]
	} catch (e) {
		return ServerError.fromError(e).emmit()
	}
}

export async function getOrdersAction() {
	try {
		const user = await auth();

		const orders = await (user.role !== "admin"
			? OrderModel.find({ user: user.id })
			: OrderModel.find())

		const populatedOrders = await populateOrders(orders)

		const separatedOrders = {
			completed: populatedOrders.filter(o => o.order.status === "COMPLETED"),
			processing: populatedOrders.filter(o => o.order.status !== "COMPLETED")
		};

		return separatedOrders;
	} catch (error) {
		return ServerError.fromError(error).emmit();
	}
}

async function populateOrders(orders: Order[]): Promise<PopulatedOrder[]> {
	const productSet = new Set(
		orders.flatMap((order) => Object.keys(order.order).map(Number)),
	);

	const products = await getProductsByIds(Array.from(productSet));
	const populatedOrders: PopulatedOrder[] = []
	for (const order of orders) {
		const populatedProducts: PopulatedProduct[] = [];
		for (const id in order.order) {
			populatedProducts.push(products.find((prod) => +prod.id === +id)!);
		}
		populatedOrders.push({ products: populatedProducts, order })
	}
	return populatedOrders
}

export async function createOrderAction(
	order: Record<number, { price: number; amount: number }>,
) {
	try {
		const user = await auth("user");
		const props = {
			order,
			user: user.id,
		};
		const res = await OrderModel.create(props)
		if (!res) throw ServerError.unknown()
		return res.code
	} catch (e) {
		return ServerError.fromError(e).emmit()
	}
}

export async function changeOrderAction(id: number, form: FormData | Partial<Order>) {
	return modelGeneralAction(OrderModel, form, id);
}


export async function completeOrderAction(id: number) {
	try {
		const [order] = await Promise.all([
			OrderModel.findOne({ id }),
			auth("admin"),
		]);
		if (!order) throw ServerError.notFound();
		const user = await UserModel.findOne({ id: order.user });
		if (!user) throw ServerError.notFound();
		const oldProds = Object.keys(user.votes);
		const newVotes = Object.fromEntries(
			Object.keys(order.order)
				.filter((newProd) => !oldProds.includes(newProd))
				.map((prod) => [prod, 0]),
		);
		const votes = { ...user.votes, ...newVotes };
		const [res, updatedUser] = await Promise.all([
			OrderModel.patch(id, { status: "COMPLETED" }),
			UserModel.patch(user.id, { votes })
			/* UserModel.model.execute<{ votes: Record<string, number> }>(sql`
				UPDATE shop.users
				SET votes=${votes}
				WHERE id=${order.user}
				RETURNING votes
			`), */
		]);
		if (!res) throw ServerError.notFound();
		if (updatedUser)
			UserCache.patch(user.name, updatedUser);
		return false;
	} catch (error) {
		return ServerError.fromError(error).emmit();
	}
}

export async function deleteOrdersAction(inp: number | number[]) {
	try {
		const ids = toArray(inp);
		if (!ids.length) throw ServerError.invalid();
		await auth("admin");
		const res = await OrderModel.model
			.delete(OrderModel.table)
			.where(inArray(OrderModel.table.id, ids))
			.returning({ id: OrderModel.table.id });
		return res.length;
	} catch (error) {
		return ServerError.fromError(error).emmit();
	}
}

export async function markOrderSeenAction(id: number) {
	try {
		const [user, order] = await Promise.all([
			auth("user"),
			OrderModel.findOne({ id }),
		]);
		if (!order) throw ServerError.notFound("Order not found");
		if (order.user !== user.id)
			throw ServerError.notAllowed("You were not supposed to see that order :(");
		const res = await OrderModel.patch(id, { seen: true });
		if (!res) throw ServerError.unknown("markOrderSeenAction after patch");
	} catch (error) {
		return ServerError.fromError(error).emmit();
	}
}

export async function getOrderNotificationsAction() {
	try {
		const user = await auth("user");
		const res = await OrderModel.find({
			seen: false,
			status: "COMPLETED",
			user: user.id,
		});
		return res.length;
	} catch (error) {
		ServerError.fromError(error).log();
		return 0;
	}
}
