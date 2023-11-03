import React from 'react'
import Form from '@/components/forms/Registration'
import prepareNewUser from '@/actions/newUser'

interface formFields {
    username: string
    image: any
}

export default function RegisterPage() {
    return (
        <div className="">
            <h1 className="">Registration</h1>
            <Form />
        </div>
    )
}
