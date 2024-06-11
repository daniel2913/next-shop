import { PgreModel } from "./base";
import { BrandPgreTable, BrandInsertValidation, type Brand } from "./Brand";
import { CategoryPgreTable, CategoryInsertValidation, type Category, } from "./Category";
import { ProductPgreTable, ProductInsertValidation, type Product, } from "./Product";
import { UserPgreTable, UserInsertValidation, type User } from "./User";
import { type Discount, DiscountPgreTable, DiscountInsertValidation, } from "./Discount";
import { type Order, OrderPgreTable, OrderInsertValidation } from "./Order";

export type { Brand, Category, Product, User, Discount, Order };

export const BrandModel = globalThis.BrandModel as undefined || new PgreModel(BrandPgreTable, BrandInsertValidation)
export const CategoryModel = globalThis.CategoryModel as undefined || new PgreModel(CategoryPgreTable, CategoryInsertValidation)
export const ProductModel = globalThis.ProductModel as undefined || new PgreModel(ProductPgreTable, ProductInsertValidation)
export const OrderModel = globalThis.OrderModel as undefined || new PgreModel(OrderPgreTable, OrderInsertValidation)
export const DiscountModel = globalThis.DiscountModel as undefined || new PgreModel(DiscountPgreTable, DiscountInsertValidation)
export const UserModel = globalThis.UserModel as undefined || new PgreModel(UserPgreTable, UserInsertValidation)

globalThis.BrandModel ||= BrandModel
globalThis.CategoryModel ||= CategoryModel
globalThis.ProductModel ||= ProductModel
globalThis.OrderModel ||= OrderModel
globalThis.UserModel ||= UserModel
globalThis.DiscountModel ||= DiscountModel
