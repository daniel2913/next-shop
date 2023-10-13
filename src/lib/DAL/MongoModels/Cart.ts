import { prop } from '@typegoose/typegoose'
import type { Ref } from '@typegoose/typegoose'
import { Product, User } from './index.ts'
import mongoose from 'mongoose'

export class Item {
    @prop({ required: true, ref: () => Product })
    public product: Ref<Product>

    @prop({ required: true, default: 1 })
    public amount: number
}

export default class Cart {
    @prop({
        auto: true,
        default: () => new mongoose.Types.ObjectId().toString(),
    })
    public _id?: string

    @prop({ ref: () => User, required: true })
    public user_id: Ref<User>

    @prop({ type: () => [Item] })
    public items?: Item[]
}
