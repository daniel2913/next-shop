import { Cart } from './index.ts'
import loginValidators from '../validations/user/usernameValidation/serverUsernameValidation.ts'
import mongoose from 'mongoose'
import { prop, DocumentType } from '@typegoose/typegoose'
import { newDocument } from '../helpers.ts'

export default class User {
    @prop({
        auto: true,
        default: () => new mongoose.Types.ObjectId().toString(),
    })
    public _id?: string

    @prop({ required: true, validate: loginValidators })
    public username: string

    @prop()
    public image?: string

    @prop({ required: true })
    public passwordHash: string

    @prop({ required: true, default: 'user' })
    public role?: string

    @prop({ required: true, default: JSON.stringify([]) })
    public cart?: string

    public createCart(this: DocumentType<User>) {
        const newCart = newDocument(Cart, {
            user_id: this.id,
            items: [],
        })
        this.cart = '[]'
        return newCart
    }
}
