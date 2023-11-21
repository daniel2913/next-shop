import mongoose from "mongoose";
import { MongoModel, PgreModel } from "./base";
import {
	BrandMongoSchema,
	BrandPgreTable,
	BrandValidations,
	Brand
} from "./Brand";
import {
	CategoryMongoSchema,
	CategoryPgreTable,
	CategoryValidations,
	Category
} from "./Category";
import {
	ProductMongoSchema,
	ProductPgreTable,
	ProductValidations,
	Product
} from "./Product";
import {
	UserMongoSchema,
	UserPgreTable,
	UserValidations,
	User
} from "./User";

export type { Brand, Category, Product, User }

const DB = process.env.DB;


export const BrandModel = (
	DB === "MONGO"
		? new MongoModel(
			mongoose.models?.brand || mongoose.model("brand", BrandMongoSchema),
			BrandValidations,
		)
		: new PgreModel(BrandPgreTable, BrandValidations)
) as MongoModel<typeof BrandMongoSchema> | PgreModel<typeof BrandPgreTable>;

export const CategoryModel = (
	DB === "MONGO"
		? new MongoModel(
			mongoose.models?.category ||
			mongoose.model("category", CategoryMongoSchema),
			CategoryValidations,
		)
		: new PgreModel(CategoryPgreTable, CategoryValidations)
) as
	| MongoModel<typeof CategoryMongoSchema>
	| PgreModel<typeof CategoryPgreTable>;

export const ProductModel = (
	DB === "MONGO"
		? new MongoModel(
			mongoose.models?.product ||
			mongoose.model("product", ProductMongoSchema),
			ProductValidations,
		)
		: new PgreModel(ProductPgreTable, ProductValidations)
) as MongoModel<typeof ProductMongoSchema> | PgreModel<typeof ProductPgreTable>;

export const UserModel = (
	DB === "MONGO"
		? new MongoModel(
			mongoose.models?.user || mongoose.model("user", UserMongoSchema),
			UserValidations,
		)
		: new PgreModel(UserPgreTable, UserValidations)
) as MongoModel<typeof UserMongoSchema> | PgreModel<typeof UserPgreTable>;
