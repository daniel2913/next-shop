import { prop } from '@typegoose/typegoose'
import mongoose from 'mongoose'
import categoryNameValidators from '../Validations/Category/categoryNameValidation/serverCategoryValidation'

export default class Category {
    @prop({ auto: true })
    public _id?: mongoose.Types.ObjectId

    @prop({ required: true, validate: categoryNameValidators })
    public name: string

    @prop({ required: true })
    public image: string
}
