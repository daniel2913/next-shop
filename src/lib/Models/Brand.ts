import { fileSchema, pgreDefaults, shop, validations } from "./common";
import { z } from "zod";
import { toArray } from "@/helpers/misc";

const BrandInsertValidation = z.object({
	name: validations.name,
	images: fileSchema.or(z.array(fileSchema).length(1))
		.optional()
		.transform(file => (file ? toArray(file) : undefined) as unknown as string[])
});

const config = {
	id: pgreDefaults.id,
	name: pgreDefaults.name.unique(),
	images: pgreDefaults.image,
};

const BrandPgreTable = shop.table("brands", config);

export type Brand = typeof BrandPgreTable.$inferSelect;

export { BrandPgreTable, BrandInsertValidation };
