import { createHash } from 'crypto'
import { UserModel } from '../../MongoModels'
import { User } from 'next-auth'
import { isDocument } from '@typegoose/typegoose/lib/typeguards'

type props = Record<'username' | 'password', string> | undefined

export default async function authUser(props: props) {
    const password = props?.password
    const username = props?.username
    if (!password || !username) return null
    const hash = createHash('sha256')
    hash.update(password)
    hash.update(username)
    const passwordHash = hash.digest('base64')
    console.log(passwordHash)
    const user = await UserModel.findOne({ username })
        .populate('cart')
        .lean()
        .exec()
    if (!user) return null
    const cart = !isDocument(user.cart) ? null : user.cart
    if (user?.passwordHash == passwordHash) {
        return {
            id: user._id.toString(),
            name: user.username,
            image: user.image,
            cart,
        }
    }
    return null
}