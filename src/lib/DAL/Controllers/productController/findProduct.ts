import { mongoose } from '@typegoose/typegoose'
import {
    BrandModel,
    CategoryModel,
    ProductModel,
} from '../../MongoModels/index.ts'
import { productSearchQuerysTypes } from './index.ts'

interface productQuery {
    name?: RegExp
    price?: {
        $gt?: number | null
        $lt?: number | null
    }
    category?: mongoose.Types.ObjectId | null
    brand?: mongoose.Types.ObjectId | null
}

export default async function findProduct(args: productSearchQuerysTypes) {
    const query: Partial<productQuery> = {}

    if (args.name) {
        query.name = RegExp(`${args?.name || ''}`)
    }

    if (args.price) {
        query.price = {}
        const [minPrice, maxPrice] = args.price.split('-')
        if (Number(minPrice) > 0) {
            query.price.$gt = Number(minPrice)
        }
        if (Number(maxPrice) > 0) {
            query.price.$lt = Number(maxPrice)
        }
    }

    if (args.category) {
        const checkCat = await CategoryModel.exists({ name: args.category })
        query.category = checkCat?._id
    }

    if (args.brand) {
        const checkBrand = await BrandModel.exists({ name: args.brand })
        query.brand = checkBrand?._id
    }

    return ProductModel.find(query)
        .then((res) => Promise.all(res.map((doc) => doc.populate('category'))))
        .then((res) =>
            Promise.all(
                res.map((doc) => doc.populate('brand', ['link', 'name']))
            )
        )
}
