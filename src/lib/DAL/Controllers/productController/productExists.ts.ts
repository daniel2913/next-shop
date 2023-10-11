import { mongoose } from '@typegoose/typegoose'
import { ProductModel } from '../../MongoModels/index.ts'

export default async function productExists(id: string) {
    return ProductModel.findById(id)
}
