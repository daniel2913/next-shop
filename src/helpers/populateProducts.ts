"use server";
import type { Brand, Category } from "@/lib/Models";
import { BrandCache, CategoryCache, DiscountCache } from "./cache";
import type { PopulatedProduct, Product } from "@/lib/Models/Product";

const unknownBrand: Brand = {
	name: "unknown",
	images: ["template.jpg"],
	id: -1,
};

const unknownCategory: Category = {
	name: "unknown",
	images: ["template.jpg"],
	id: -1,
};

export async function populateProducts(
	products: Product[],
): Promise<PopulatedProduct[]> {
	const [brands, categories, discounts] = await Promise.all([
		BrandCache.get(),
		CategoryCache.get(),
		DiscountCache.get(),
	]);
	const now = Date.now();
	const applicableDiscounts = discounts.filter(
		(discount) => Number(discount.expires) > now,
	);
	const populatedProducts = products.map((product) => {
		const brand = brands.find((brand) => brand.id === product.brand);
		const category = categories.find(
			(category) => category.id === product.category,
		);
		const discount = applicableDiscounts.reduce((prev, next) => {
			if (next.discount <= prev) return prev;
			if (
				next.categories.includes(product.category) ||
				next.brands.includes(product.brand) ||
				next.products.includes(product.id)
			)
				return next.discount;
			return prev;
		}, 0);

		return {
			...product,
			description: "",
			brand: brand || unknownBrand,
			category: category || unknownCategory,
			discount,
		};
	});
	return populatedProducts;
}
