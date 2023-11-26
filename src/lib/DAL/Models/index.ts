import mongoose from "mongoose"
import { MongoModel, PgreModel } from "./base"
import {
	BrandMongoSchema,
	BrandPgreTable,
	BrandValidations,
	Brand,
} from "./Brand"
import {
	CategoryMongoSchema,
	CategoryPgreTable,
	CategoryValidations,
	Category,
} from "./Category"
import {
	ProductMongoSchema,
	ProductPgreTable,
	ProductValidations,
	Product,
} from "./Product"
import { UserMongoSchema, UserPgreTable, UserValidations, User } from "./User"

export type { Brand, Category, Product, User }

const DB = process.env.DB

const pgTables = [BrandPgreTable,CategoryPgreTable,ProductPgreTable,UserPgreTable]
const mongoSchemas = [BrandMongoSchema, CategoryMongoSchema, ProductMongoSchema, UserMongoSchema]



export const BrandModel = (
	DB === "MONGO"
		? new MongoModel<Brand>(
				mongoose.models?.brand || mongoose.model("brand", BrandMongoSchema),
				BrandValidations,
		  )
		: new PgreModel<Brand, typeof BrandPgreTable>(
				BrandPgreTable,
				BrandValidations,
		  )
) as MongoModel<Brand> | PgreModel<Brand, typeof BrandPgreTable>

export const CategoryModel = (
	DB === "MONGO"
		? new MongoModel<Category>(
				mongoose.models?.category ||
					mongoose.model("category", CategoryMongoSchema),
				CategoryValidations,
		  )
		: new PgreModel<Category, typeof CategoryPgreTable>(
				CategoryPgreTable,
				CategoryValidations,
		  )
) as MongoModel<Category> | PgreModel<Category, typeof CategoryPgreTable>

export const ProductModel = (
	DB === "MONGO"
		? new MongoModel<Product>(
				mongoose.models?.product || mongoose.model("product", ProductMongoSchema),
				ProductValidations,
		  )
		: new PgreModel<Product, typeof ProductPgreTable>(
				ProductPgreTable,
				ProductValidations,
		  )
) as MongoModel<Product> | PgreModel<Product, typeof ProductPgreTable>

export const UserModel = (
	DB === "MONGO"
		? new MongoModel<User>(
				mongoose.models?.user || mongoose.model("user", UserMongoSchema),
				UserValidations,
		  )
		: new PgreModel<User, typeof UserPgreTable>(UserPgreTable, UserValidations)
) as MongoModel<User> | PgreModel<User, typeof UserPgreTable>


