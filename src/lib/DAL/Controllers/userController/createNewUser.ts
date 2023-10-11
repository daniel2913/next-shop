import { newDocument, isMongoError, noFunc } from '../../helpers.ts'
import { User } from '../../MongoModels/index.ts'

export default async function createNewUser({
    imageName,
    ...args
}: noFunc<User> & { imageName?: string }) {
    const newUser = newDocument(User, { ...args })

    let err = null
    try {
        await newUser.validate()
    } catch (error) {
        err = isMongoError(error)
            ? error.message
            : error ?? 'Some error occured during validation'
    }
    if (err) throw err

    let user = null
    try {
        await newUser.createCart().save()
        user = await newUser.save()
    } catch (error) {
        err = error
    }
    return !user ? err || 'Connection Error' : user
}
