import { PgreModel } from "./base"
import { BrandPgreTable, BrandInsertValidation, Brand } from "./Brand"
import { CategoryPgreTable, CategoryInsertValidation, Category } from "./Category"
import {ProductPgreTable,ProductInsertValidation,Product,} from "./Product"
import { UserPgreTable, UserInsertValidation, User} from "./User"
import { Discount, DiscountPgreTable, DiscountInsertValidation } from "./Discount"
import {Order,OrderPgreTable,OrderInsertValidation} from "./Order"

export type { Brand, Category, Product, User, Discount, Order }

global.BrandModel ||= new PgreModel(BrandPgreTable,BrandInsertValidation)
global.CategoryModel ||= new PgreModel(CategoryPgreTable,CategoryInsertValidation)
global.ProductModel ||= new PgreModel(ProductPgreTable,ProductInsertValidation)
global.UserModel ||= new PgreModel(UserPgreTable,UserInsertValidation)
global.DiscountModel ||= new PgreModel(DiscountPgreTable,DiscountInsertValidation)
global.OrderModel ||= new PgreModel(OrderPgreTable,OrderInsertValidation)

export const BrandModel = (global as any).BrandModel as PgreModel<typeof BrandPgreTable, Brand, typeof BrandInsertValidation>
export const CategoryModel = (global as any).CategoryModel as PgreModel<typeof CategoryPgreTable, Category, typeof CategoryInsertValidation>
export const ProductModel = (global as any).ProductModel as PgreModel<typeof ProductPgreTable, Product, typeof ProductInsertValidation>
export const UserModel = (global as any).UserModel as PgreModel<typeof UserPgreTable, User, typeof UserInsertValidation>
export const DiscountModel = (global as any).DiscountModel as PgreModel<typeof DiscountPgreTable, Discount, typeof DiscountInsertValidation>
export const OrderModel = (global as any).OrderModel as PgreModel<typeof OrderPgreTable, Order, typeof OrderInsertValidation>
// export const BrandModel = cache(new PgreModel(BrandPgreTable,BrandInsertValidation))
//
// export const CategoryModel = cache(()=>new PgreModel(CategoryPgreTable,CategoryInsertValidation))

// export const ProductModel = new PgreModel(ProductPgreTable, ProductInsertValidation)
//
// export const UserModel = new PgreModel(UserPgreTable, UserInsertValidation)
//
//
// export const DiscountModel = new PgreModel(DiscountPgreTable,DiscountInsertValidation)
//
// export const OrderModel = new PgreModel(OrderPgreTable, OrderInsertValidation)
