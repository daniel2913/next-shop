import { UserModel } from '../../../Models/index.ts'
import { clientUserNameValidation } from './clientUsernameValidation.ts'

async function serverUsernameValidation(login: string) {
    if (await UserModel.exists({ name: login }))
        return 'Username is already taken'

    return false
}

const loginValidators = [
    {
        validator: async (login: string) => {
            const error = await serverUsernameValidation(login)
            if (error) return false
            return true
        },
        msg: 'Username Already Taken',
    },
    {
        // User name should have at least 4 characters, but no more than 20
        validator: (login: string) => {
            const error = clientUserNameValidation(login)
            if (error) return false
            return true
        },
        msg: 'Invalid Username. Try Reloading the Page',
    },
]

export default loginValidators
