import authUser from '@/lib/DAL/Controllers/userController/authUser'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: {
                    label: 'Username',
                    type: 'text',
                    placeholder: 'jsmith',
                },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                const user = await authUser(credentials)
                if (user) {
                    console.log(user, ' logged in!')
                    return user
                }
                console.log('Fucky-Wacky were made by ', credentials)
                return null
            },
        }),
    ],
    session: {
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
    },
    secret: 'FsLlSA0KpXaM7sHNlqrgpO9SlZBsR0/33ndqledspqQ=',
})

export { handler as GET, handler as POST }
