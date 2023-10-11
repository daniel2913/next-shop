import brandNameValidators from '../Validations/Brand/brandNameValidation/serverBrandValidation'
import { defaultId } from './common'

export const userProps = [
    '_id',
    'username',
    'passwordHash',
    'role',
    'cart',
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
