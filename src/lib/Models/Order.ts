//import { UserPgreTable } from "./User.ts";
import { boolean, jsonb, smallint, uuid, varchar } from "drizzle-orm/pg-core";
import { pgreDefaults, validations } from "./common.ts";
import { shop } from "./common.ts";
import { z } from "zod";
import { getProductsByIdsAction } from "@/actions/product.ts";
import { calcDiscount } from "@/helpers/misc.ts";

const OrderInsertValidation = z.object({
	user: validations.id,
	order: z
		.record(
			z.coerce.number().nonnegative(),
			z.object({
				amount: z.coerce.number().positive(),
				price: z.coerce.number().positive(),
			}),
		)
		.refine(async (order) => {
			const products = await getProductsByIdsAction(
				Object.keys(order).map(Number),
			);
			if ("error" in products) return false;
			if (products.length !== Object.keys(order).length) return false;
			return products
				.map(
					(product) => {
						return calcDiscount(product.price, product.discount) ===
							order[product.id].price
					}
				)
				.reduce((prev, cur) => prev && cur, true);
		}, "Some order details are out of date"),
	status: z.enum(["PROCESSING", "COMPLETED", "DELIVERING", "PREPARING"]).default("PROCESSING"),
	seen: z.boolean().default(false),
	code: z.string().optional()
});


const config = {
	id: pgreDefaults.id,
	user: smallint("user_id")
		.notNull(),
	rating: smallint("rating").default(0).notNull(),
	status: varchar("status").default("PROCESSING").notNull().$type<"PROCESSING" | "COMPLETED" | "DELIVERING" | "PREPARING">(),
	code: uuid("code").default(null as unknown as string).notNull(),
	order: jsonb("order_content")
		.notNull()
		.$type<Record<number, { amount: number; price: number }>>(),
	seen: boolean("seen").default(false).notNull(),
};

export type Order = typeof OrderPgreTable.$inferSelect;

const OrderPgreTable = shop.table("orders", config);

export { OrderPgreTable, OrderInsertValidation };
