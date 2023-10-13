import { Cart } from './index.ts'
import loginValidators from '../Validations/User/usernameValidation/serverUsernameValidation.ts'
import mongoose from 'mongoose'
import {
    prop,
    DocumentType,
    queryMethod,
    getModelForClass,
    modelOptions,
} from '@typegoose/typegoose'
import type { Ref } from '@typegoose/typegoose'
import { newDocument } from '../helpers.ts'
import { Schema } from './common.ts'
import { UserType, userProps } from '../DataTypes/User.ts'

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

    // eslint-disable-next-line no-unused-vars
    public createCart(this: DocumentType<User>) {
        const newCart = newDocument(Cart, {
            user_id: this.id,
            items: [],
        })
        this.cart = '[]'
        return newCart
    }
}
