import { prop } from '@typegoose/typegoose'
import mongoose from 'mongoose'
import categoryNameValidators from '../Validations/Category/categoryNameValidation/serverCategoryValidation'

export default class Category {
    @prop({
        auto: true,
        default: () => new mongoose.Types.ObjectId().toString(),
    })
    public _id?: string

    @prop({ required: true, validate: categoryNameValidators })
    public name: string

    @prop({ required: true })
    public image: string
}
