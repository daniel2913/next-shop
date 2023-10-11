import brandNameValidators from '../Validations/Brand/brandNameValidation/serverBrandValidation'
import { defaultId } from './common'

export const brandProps = [
    '_id',
    'name',
    'description',
    'image',
    'link',
] as const

export const BrandType = {
    _id: {
        type: 'ObjectId',
        default: defaultId,
    },
    name: {
        type: 'string',
        validate: brandNameValidators,
        default: () => 'This is a default Brand Name!',
    },
    description: {
        type: 'string',
        default: () => 'This is a default description!',
    },
    image: {
        type: 'string',
        default: () => 'template.jpeg',
    },
    link: {
        type: 'string',
        default: () => './',
    },
} as const
