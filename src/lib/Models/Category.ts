import { fileSchema, pgreDefaults, shop, validations } from "./common";
import { z } from "zod";
import { toArray } from "@/helpers/misc";

const CategoryInsertValidation = z.object({
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

const CategoryPgreTable = shop.table("categories", config);

export type Category = typeof CategoryPgreTable.$inferSelect;

export { CategoryPgreTable, CategoryInsertValidation };
