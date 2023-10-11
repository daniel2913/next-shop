import { prop } from '@typegoose/typegoose'
import type { Ref } from '@typegoose/typegoose'
import mongoose from 'mongoose'
import { Brand } from './index.ts'

export default class Product {
    @prop({ required: true, auto: true })
    public _id: mongoose.Types.ObjectId

    @prop({ required: true })
    public name: string

    @prop({ required: true })
    public category: string

    @prop({ required: true, ref: () => Brand })
    public brand: Ref<Brand>

    @prop({ required: true })
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
