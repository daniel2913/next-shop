import { BrandModel, CategoryModel, Product, ProductModel } from '@/lib/DAL/MongoModels';
import dbConnect from '@/lib/dbConnect';
import { cache } from 'react';


export const getAllBrands = cache(async()=>{await dbConnect();return BrandModel.find().lean().exec()})
export const getAllCategories = cache(async()=>{await dbConnect();return CategoryModel.find().lean().exec()})
