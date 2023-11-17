import { BrandModel, CategoryModel, Product, ProductModel } from '@/lib/DAL/Models';
import dbConnect from '@/lib/dbConnect';
import { cache } from 'react';


export const getAllBrands = cache(async()=>{await dbConnect();return BrandModel.find(undefined)})
export const getAllCategories = cache(async()=>{await dbConnect();return CategoryModel.find(undefined)})
