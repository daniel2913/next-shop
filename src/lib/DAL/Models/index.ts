import mongoose from "mongoose";

import { BrandMongoSchema, BrandPgreTable, BrandValidations } from "./Brand";
import { MongoModel, PgreModel } from "./base";
import {
	CategoryMongoSchema,
	CategoryPgreTable,
	CategoryValidations,
} from "./Category";
import {
	ProductMongoSchema,
	ProductPgreTable,
	ProductValidations,
} from "./Product";
import { UserMongoSchema, UserPgreTable, UserValidations } from "./User";

const DB = process.env.DB;

export {
	BrandMongoSchema as Brand,
	CategoryMongoSchema as Category,
	ProductMongoSchema as Product,
	UserMongoSchema as User,
};

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
