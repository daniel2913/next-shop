import { PgreModel } from "./base"
import {
	BrandPgreTable,
	BrandValidations,
	Brand,
} from "./Brand"
import {
	CategoryPgreTable,
	CategoryValidations,
	Category,
} from "./Category"
import {
	ProductPgreTable,
	ProductValidations,
	ProductCustomQueries,
	Product,
} from "./Product"
import {
	UserPgreTable,
	UserValidations,
	User
} from "./User"
import {
	RatingPgreTable,
	RatingValidations,
	Rating
} from "./Rating"
import {
	Discount,
	DiscountPgreTable,
	DiscountValidations
} from "./Discount"


export type { Brand, Category, Product, User }


export const BrandModel = new PgreModel<Brand, typeof BrandPgreTable>(
	BrandPgreTable,
	BrandValidations,
)

export const CategoryModel = new PgreModel<Category, typeof CategoryPgreTable>(
		CategoryPgreTable,
		CategoryValidations,
	)

export const ProductModel = new PgreModel<Product, typeof ProductPgreTable, typeof ProductCustomQueries>(
		ProductPgreTable,
		ProductValidations,
		ProductCustomQueries
	)


export const UserModel = new PgreModel<User, typeof UserPgreTable>(
	UserPgreTable,
	UserValidations
)

export const RatingModel = new PgreModel<Rating, typeof RatingPgreTable>(
	RatingPgreTable,
	RatingValidations
)

export const DiscountModel = new PgreModel<Discount, typeof DiscountPgreTable>(
	DiscountPgreTable,
	DiscountValidations
)
