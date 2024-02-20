import { PgreModel } from "./base"
import { BrandPgreTable, BrandInsertValidation, Brand } from "./Brand"
import { CategoryPgreTable, CategoryInsertValidation, Category } from "./Category"
import {ProductPgreTable,ProductInsertValidation,Product,} from "./Product"
import { UserPgreTable, UserInsertValidation, User} from "./User"
import { Discount, DiscountPgreTable, DiscountInsertValidation } from "./Discount"
import {Order,OrderPgreTable,OrderInsertValidation} from "./Order"

export type { Brand, Category, Product, User, Discount, Order }

globalThis.BrandModel ||= new PgreModel(BrandPgreTable,BrandInsertValidation)
globalThis.CategoryModel ||= new PgreModel(CategoryPgreTable,CategoryInsertValidation)
globalThis.ProductModel ||= new PgreModel(ProductPgreTable,ProductInsertValidation)
globalThis.UserModel ||= new PgreModel(UserPgreTable,UserInsertValidation)
globalThis.DiscountModel ||= new PgreModel(DiscountPgreTable,DiscountInsertValidation)
globalThis.OrderModel ||= new PgreModel(OrderPgreTable,OrderInsertValidation)

export const BrandModel = globalThis.BrandModel as PgreModel<typeof BrandPgreTable, typeof BrandInsertValidation>
export const CategoryModel = globalThis.CategoryModel as PgreModel<typeof CategoryPgreTable, typeof CategoryInsertValidation>
export const ProductModel = globalThis.ProductModel as PgreModel<typeof ProductPgreTable, typeof ProductInsertValidation>
export const UserModel = globalThis.UserModel as PgreModel<typeof UserPgreTable,typeof UserInsertValidation>
export const DiscountModel = globalThis.DiscountModel as PgreModel<typeof DiscountPgreTable, typeof DiscountInsertValidation>
export const OrderModel = globalThis.OrderModel as PgreModel<typeof OrderPgreTable, typeof OrderInsertValidation>


