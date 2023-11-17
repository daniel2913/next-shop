'use client'
import { handleRegistrationForm } from '@/Actions/newUser'
import styles from './index.module.scss'
import LabeledInput from '@/components/ui/LabeledInput'
import { clientPasswordValidation } from '@/lib/DAL/Validations/User/passwordValidation/clientPasswordValidation'
import { clientUserNameValidation } from '@/lib/DAL/Validations/User/usernameValidation/clientUsernameValidation'

export default function Form() {
    return (
        <form action={handleRegistrationForm}>
            <LabeledInput
                type="file"
                label="Profile picture"
                id="image"
                className={styles.image}
            />
            <LabeledInput
                id="name"
                type="username"
                validator={clientUserNameValidation}
                label="Username"
                placeholder="UserName"
                className={styles.login}
            />
            <LabeledInput
                id="password"
                type="password"
                validator={clientPasswordValidation}
                label="Password"
                placeholder="Password"
                className={styles.password}
            />
            <button type="submit" className={styles.submit}>
                Register
            </button>
        </form>
    )
}
