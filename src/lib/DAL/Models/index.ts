import { PgreModel } from "./base"
import { BrandPgreTable, BrandInsertValidation, Brand } from "./Brand"
import { CategoryPgreTable, CategoryInsertValidation, Category } from "./Category"
import {ProductPgreTable,ProductInsertValidation,Product,} from "./Product"
import { UserPgreTable, UserInsertValidation, User} from "./User"
import { Discount, DiscountPgreTable, DiscountInsertValidation } from "./Discount"
import {Order,OrderPgreTable,OrderInsertValidation} from "./Order"

export type { Brand, Category, Product, User, Discount, Order }

export const BrandModel = new PgreModel(BrandPgreTable,BrandInsertValidation)

export const CategoryModel = new PgreModel(CategoryPgreTable,CategoryInsertValidation)

export const ProductModel = new PgreModel(ProductPgreTable, ProductInsertValidation)

export const UserModel = new PgreModel(UserPgreTable, UserInsertValidation)

export const DiscountModel = new PgreModel(DiscountPgreTable,DiscountInsertValidation)

export const OrderModel = new PgreModel(OrderPgreTable, OrderInsertValidation)
