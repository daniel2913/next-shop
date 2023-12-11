import { PgreModel } from "./base"
import { BrandPgreTable, BrandValidations, Brand } from "./Brand"
import { CategoryPgreTable, CategoryValidations, Category } from "./Category"
import {
	ProductPgreTable,
	ProductValidations,
	ProductCustomQueries,
	Product,
} from "./Product"
import { UserPgreTable, UserValidations, User, UserCustomQuerys } from "./User"
import { RatingPgreTable, RatingValidations, Rating } from "./Rating"
import { Discount, DiscountPgreTable, DiscountValidations } from "./Discount"
import {
	Order,
	OrderCustomQueries,
	OrderPgreTable,
	OrderValidations,
} from "./Order"

export type { Brand, Category, Product, User }

export const BrandModel = new PgreModel<typeof BrandPgreTable, Brand>(
	BrandPgreTable,
	BrandValidations
)

export const CategoryModel = new PgreModel<typeof CategoryPgreTable, Category>(
	CategoryPgreTable,
	CategoryValidations
)

export const ProductModel = new PgreModel<
	typeof ProductPgreTable,
	Product,
	typeof ProductCustomQueries
>(ProductPgreTable, ProductValidations, ProductCustomQueries)

export const UserModel = new PgreModel<
	typeof UserPgreTable,
	User,
	typeof UserCustomQuerys
>(UserPgreTable, UserValidations, UserCustomQuerys)

export const RatingModel = new PgreModel<typeof RatingPgreTable, Rating>(
	RatingPgreTable,
	RatingValidations
)

export const DiscountModel = new PgreModel<typeof DiscountPgreTable, Discount>(
	DiscountPgreTable,
	DiscountValidations
)

export const OrderModel = new PgreModel<
	typeof OrderPgreTable,
	Order,
	typeof OrderCustomQueries
>(OrderPgreTable, OrderValidations, OrderCustomQueries)
