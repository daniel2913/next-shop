import { type Brand, BrandPgreTable } from "./Brand.ts";
import { type Category, CategoryPgreTable } from "./Category.ts";
import {
	integer,
	real,
	serial,
	smallint,
	varchar,
} from "drizzle-orm/pg-core";
import { fileSchema, MAX_SIZES, pgreDefaults, validations } from "./common.ts";
import { shop } from "./common.ts";
import { z } from "zod";
import { BrandCache, CategoryCache } from "@/helpers/cache.ts";
import { deleteImages, handleImages, saveImages } from "@/helpers/images.ts";
import { toArray } from "@/helpers/misc.ts";
import { ServerError } from "@/actions/common.ts";

const brandSchema = z
	.string()
	.or(z.number())
	.transform(async (brand) => {
		const brands = await BrandCache.get();
		if (Number.isNaN(+brand))
			return brands.find((b) => b.name === brand)?.id || -1;
		return brands.find((b) => b.id === +brand)?.id || -1;
	})
	.refine((n) => n > -1, { message: "Brand Does Not Exist" });

const categorySchema = z
	.string()
	.or(z.number())
	.transform(async (category) => {
		const categories = await CategoryCache.get();
		let res = -1;
		if (Number.isNaN(+category))
			res = categories.find((c) => c.name === category)?.id || -1;
		else res = categories.find((c) => c.id === +category)?.id || -1;
		return res;
	})
	.refine((n) => n > -1, { message: "Category Does Not Exist" });


export async function imagesHandler(path: string, _files: File[] | File, prev?: string[]) {
	const files = toArray(_files)
	let newImages: File[]
	const imagesToKeep: string[] = []
	const imagesToDelete: string[] = []
	if (!prev)
		newImages = files
	else {
		newImages = files.filter(file => !prev.includes(file.name))
		const newNames = newImages.map(i => i.name)
		imagesToKeep.push(...prev.filter(name => newNames.includes(name)))
		imagesToDelete.push(...prev.filter(name => !newNames.includes(name)))
	}
	const namedImages = await handleImages(newImages, path)
	const saved = await saveImages(namedImages, path)
	if (!saved || saved.length !== namedImages.length) throw ServerError.unknown("Error while trying to save new images")
	const names = namedImages.map(r => r.name)
	return {
		names: [...names, ...imagesToKeep],
		writeChanges: () => deleteImages(imagesToDelete, path),
		rollback: () => deleteImages(names, path)
	}
}

const ProductInsertValidation = z.object({
	name: validations.name,
	description: validations.description,
	brand: brandSchema,
	category: categorySchema,
	price: z.coerce
		.number()
		.positive(),
	images: z
		.array(fileSchema)
		.or(fileSchema)
		.optional()
		.transform((files) =>
			(files ? toArray(files) : undefined) as unknown as string[],
		)
});

const config = {
	id: pgreDefaults.id,
	name: pgreDefaults.name,
	brand: serial("brand")
		.notNull()
		.references(() => BrandPgreTable.id),
	category: serial("category")
		.notNull()
		.references(() => CategoryPgreTable.id),
	description: pgreDefaults.description,
	images: varchar("images", { length: MAX_SIZES.image }).array().notNull(),
	price: integer("price").notNull(),
	votes: integer("votes").default(0).notNull(),
	voters: smallint("voters").default(0).notNull(),
	rating: real("rating").default(0).notNull(),
};

const ProductPgreTable = shop.table("products", config);

export type Product = typeof ProductPgreTable.$inferSelect;
export type PopulatedProduct = Omit<Product, "brand" | "category" | "votes"> & {
	brand: Brand;
	category: Category;
	discount: number;
};

export { ProductPgreTable, ProductInsertValidation };
