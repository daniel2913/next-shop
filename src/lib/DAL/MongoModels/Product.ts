import { prop } from '@typegoose/typegoose'
import type { Ref } from '@typegoose/typegoose'
import mongoose from 'mongoose'
import { Brand } from './index.ts'
import productBrandNameValidators from '../validations/product/productBrandValidation/serverBrandValidation.ts'
import productCategoryNameValidators from '../validations/product/productCategoryValidation/serverCategoryValidation.ts'
import productLinkValidators from '../validations/product/productLinkValidation/serverLinkValidation.ts'

export default class Product {
    @prop({
        auto: true,
        default: () => new mongoose.Types.ObjectId().toString(),
    })
    public _id?: string

    @prop({ required: true })
    public name: string

    @prop({ required: true, validate: productCategoryNameValidators })
    public category: string

    @prop({
        required: true,
        ref: () => Brand,
        validate: productBrandNameValidators,
    })
    public brand: Ref<Brand>

    @prop({ required: true, validate: productLinkValidators })
    public link: string

    @prop({ default: 'This is a default description' })
    public description: string

    @prop({ type: [String], default: ['template.jpeg'] })
    public images: string[]

    @prop({ required: true })
    public price: number

    @prop({ required: true, default: 0 })
    public discount: number
}
