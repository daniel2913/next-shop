import { prop } from '@typegoose/typegoose'
import type { Ref } from '@typegoose/typegoose'
import { Product } from './index.ts'
import mongoose from 'mongoose'

class Item {
    @prop({ required: true, ref: () => Product })
    public product: Ref<Product>
    @prop({ required: true, default: 1 })
    public amount: number
}

export default class Inventory {
    @prop({
        auto: true,
        default: () => new mongoose.Types.ObjectId().toString(),
    })
    public _id?: string

    @prop({ required: true, type: () => [Item], default: [] })
    public item: Item[]
}
