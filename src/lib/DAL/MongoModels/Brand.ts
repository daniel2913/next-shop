import {
    DocumentType,
    mongoose,
    prop,
    queryMethod,
    types,
} from '@typegoose/typegoose'
import { ObjectId } from 'mongoose'

export interface BrandQueryHelpers {
    findByName: types.AsQueryMethod<typeof findByName>
}

function findByName(
    this: types.QueryHelperThis<typeof Brand, BrandQueryHelpers>,
    name: string
) {
    return this.findOne({ name })
}

@queryMethod(findByName)
class Brand {
    @prop({
        default: () => new mongoose.Types.ObjectId().toString(),
    })
    public _id?: string

    @prop({ required: true, default: () => 'Default brand name' })
    public name: string

    @prop({ required: true, default: () => 'Default brand description' })
    public description: string

    @prop({ required: true, default: () => 'template.jpeg' })
    public image: string

    @prop({ required: true, default: () => './' })
    public link: string
}

export default Brand
