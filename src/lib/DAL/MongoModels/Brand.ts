import { mongoose, prop } from '@typegoose/typegoose'

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
