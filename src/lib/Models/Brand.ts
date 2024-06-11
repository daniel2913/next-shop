import { pgreDefaults, shop, validations } from "./common";
import { z } from "zod";

const BrandInsertValidation = z.object({
	name: validations.name,
	images: validations.image
});

const config = {
	id: pgreDefaults.id,
	name: pgreDefaults.name.unique(),
	images: pgreDefaults.image,
};

const BrandPgreTable = shop.table("brands", config);

export type Brand = typeof BrandPgreTable.$inferSelect;

export { BrandPgreTable, BrandInsertValidation };
