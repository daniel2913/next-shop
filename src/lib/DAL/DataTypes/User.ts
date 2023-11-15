import { Mongoose, SchemaDefinitionProperty, SchemaTypeOptions } from 'mongoose'
import brandNameValidators from '../validations/brand/brandNameValidation/serverBrandValidation'
import { defaultId } from './common'

export const userProps = [
    '_id',
    'username',
    'passwordHash',
    'role',
    'cart',
	'orders'
] as const


export const UserType = {
    _id: {
        type: 'ObjectId',
        default: defaultId,
    },
    username: {
        type: 'string',
        default: () => 'This is a default User Name!',
    },
    passwordHash: {
        type: 'string',
        default: () => 'Something is very broken!',
    },
    role: {
        type: 'string',
        default: () => 'user',
    },
    cart: {
        type: 'link',
    },
} as const
