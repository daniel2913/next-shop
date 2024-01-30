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
global.ProductModel ||= new PgreModel(ProductPgreTable,ProductInsertValidation)
global.UserModel ||= new PgreModel(UserPgreTable,UserInsertValidation)
global.DiscountModel ||= new PgreModel(DiscountPgreTable,DiscountInsertValidation)
global.OrderModel ||= new PgreModel(OrderPgreTable,OrderInsertValidation)

export const BrandModel = (global as any).BrandModel as PgreModel<typeof BrandPgreTable, typeof BrandInsertValidation>
export const CategoryModel = (global as any).CategoryModel as PgreModel<typeof CategoryPgreTable, typeof CategoryInsertValidation>
export const ProductModel = (global as any).ProductModel as PgreModel<typeof ProductPgreTable, typeof ProductInsertValidation>
export const UserModel = (global as any).UserModel as PgreModel<typeof UserPgreTable,typeof UserInsertValidation>
export const DiscountModel = (global as any).DiscountModel as PgreModel<typeof DiscountPgreTable, typeof DiscountInsertValidation>
export const OrderModel = (global as any).OrderModel as PgreModel<typeof OrderPgreTable, typeof OrderInsertValidation>
