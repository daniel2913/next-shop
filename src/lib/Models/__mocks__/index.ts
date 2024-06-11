import { BrandInsertValidation } from "../Brand"
import { CategoryInsertValidation } from "../Category"
import { DiscountInsertValidation } from "../Discount"
import { OrderInsertValidation } from "../Order"
import { ProductInsertValidation } from "../Product"
import { UserInsertValidation } from "../User"
import type { Brand, Category, Product, Order, User, Discount } from "../index"
import { TestModel } from "./base"

class GlobalTestStorage {
	static inst: GlobalTestStorage
	public brands: Brand[] = [{ name: "test", images: [], id: 0 }]
	public categories: Category[] = [{ name: "test", images: [], id: 0 }]
	public products: Product[] = [{ name: "test", brand: 0, category: 0, votes: 0, voters: 0, images: [], description: "", price: 220, rating: 0, id: 0 }]
	public orders: Order[] = []
	public users: User[] = [
		{ name: "test", passwordHash: "", id: 0, role: "user", saved: [], votes: {}, cart: {} },
		{ name: "admin", passwordHash: "", id: 1, role: "admin", saved: [], votes: {}, cart: {} }
	]
	public discounts: Discount[] = []
	constructor() {
		if (GlobalTestStorage.inst) return GlobalTestStorage.inst
		GlobalTestStorage.inst = this
	}
}
const storage = new GlobalTestStorage()

export const BrandModel = (globalThis.BrandModel as undefined) || new TestModel("brands", BrandInsertValidation, storage)
export const CategoryModel = (globalThis.CategoryModel as undefined) || new TestModel("categories", CategoryInsertValidation, storage)
export const ProductModel = (globalThis.ProductModel as undefined) || new TestModel("products", ProductInsertValidation.omit({ brand: true, category: true }), storage)
export const OrderModel = (globalThis.OrderModel as undefined) || OrderInsertValidation && new TestModel("orders", OrderInsertValidation, storage)
export const UserModel = (globalThis.UserModel as undefined) || new TestModel("users", UserInsertValidation, storage)
export const DiscountModel = (globalThis.DiscountModel as undefined) || new TestModel("discounts", DiscountInsertValidation, storage)

globalThis.BrandModel ||= BrandModel
globalThis.CategoryModel ||= CategoryModel
globalThis.ProductModel ||= ProductModel
globalThis.OrderModel ||= OrderModel
globalThis.UserModel ||= UserModel
globalThis.DiscountModel ||= DiscountModel
