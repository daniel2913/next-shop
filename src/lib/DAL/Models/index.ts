import mongoose from 'mongoose'

import { BrandMongoSchema, BrandPgreTable } from './Brand'
import { MongoModel, PgreModel } from './base'
import { CategoryMongoSchema, CategoryPgreTable } from './Category'
import { ProductMongoSchema, ProductPgreTable } from './Product'
import { UserMongoSchema, UserPgreTable } from './User'

const DB = process.env.DB

export {BrandMongoSchema as Brand, CategoryMongoSchema as Category, ProductMongoSchema as Product, UserMongoSchema as User}

export const BrandModel = (DB ==='MONGO'
	? new MongoModel(mongoose.models['brand'] || mongoose.model('brand',BrandMongoSchema))
	: new PgreModel(BrandPgreTable)) as MongoModel<typeof BrandMongoSchema>|PgreModel<typeof BrandPgreTable>

export const CategoryModel = (DB ==='MONGO'
	? new MongoModel(mongoose.models['category'] || mongoose.model('category',CategoryMongoSchema))
	: new PgreModel(CategoryPgreTable)) as MongoModel<typeof CategoryMongoSchema>|PgreModel<typeof CategoryPgreTable>

export const ProductModel = (DB ==='MONGO'
	? new MongoModel(mongoose.models['product'] || mongoose.model('product',ProductMongoSchema))
	: new PgreModel(ProductPgreTable)) as MongoModel<typeof ProductMongoSchema>|PgreModel<typeof ProductPgreTable>

export const UserModel = (DB ==='MONGO'
	? new MongoModel(mongoose.models['user'] || mongoose.model('user',UserMongoSchema))
	: new PgreModel(UserPgreTable)) as MongoModel<typeof UserMongoSchema>|PgreModel<typeof UserPgreTable>

