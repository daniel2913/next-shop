import { UserModel } from '../../MongoModels/index.ts'

export default async function changeUserRole({
    login,
    role,
}: {
    login: string
    role: string
}) {
    return UserModel.findOne({ username: login })
        .then((user) => {
            if (!user) throw { statusCode: 404, message: 'Cannot find user' }
            user.role = role
            user.save({})
        })
        .catch(() => {
            throw { statusCode: 503, message: 'Cannot access users' }
        })
        .then(() => {
            return { login, role }
        })
        .catch(() => {
            throw { statusCode: 503, message: 'Cannot update user' }
        })
}
