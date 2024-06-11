import {
	type Brand,
	BrandModel,
	type Category,
	CategoryModel,
	type Discount,
	DiscountModel,
	type User,
	UserModel,
} from "@/lib/Models";
import { cacheParam, simpleCache } from "./cacheFunctions";


globalThis.BrandCache ||= simpleCache(() => BrandModel.find());
globalThis.CategoryCache ||= simpleCache(() => CategoryModel.find());
globalThis.DiscountCache ||= simpleCache(() => DiscountModel.find());
globalThis.UserCache ||= cacheParam((name: string) =>
	UserModel.findOne({ name }),
);

export const BrandCache = globalThis.BrandCache as ReturnType<
	typeof simpleCache<Brand[]>
>;
export const CategoryCache = globalThis.CategoryCache as ReturnType<
	typeof simpleCache<Category[]>
>;
export const DiscountCache = globalThis.DiscountCache as ReturnType<
	typeof simpleCache<Discount[]>
>;
export const UserCache = globalThis.UserCache as ReturnType<
	typeof cacheParam<User>
>;
