import { pgreDefaults, shop, validations } from "./common";
import { z } from "zod";

const CategoryInsertValidation = z.object({
	name: validations.name,
	images: validations.image
});

const config = {
	id: pgreDefaults.id,
	name: pgreDefaults.name.unique(),
	images: pgreDefaults.image,
};

const CategoryPgreTable = shop.table("categories", config);

export type Category = typeof CategoryPgreTable.$inferSelect;

export { CategoryPgreTable, CategoryInsertValidation };
