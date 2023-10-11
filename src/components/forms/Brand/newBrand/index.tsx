'use client'
import LabeledInput from '@/components/UI/LabeledInput'
import styles from './index.module.scss'
import { useState } from 'react'
import useError from '@/hooks/modals/useError'
import { handleNewBrandForm } from '@/Actions/newBrand'

export default function NewBrandForm() {
    const [loading, setLoading] = useState(false)
    const error = useError()
    return (
        <form
            onSubmit={() => setLoading(true)}
            action={async (formData: FormData) => {
                const result = await handleNewBrandForm(formData)
                setLoading(false)
                error(result)
            }}
        >
            <LabeledInput
                id="name"
                label="Brand name"
                placeholder="Brand"
            ></LabeledInput>
            <LabeledInput
                id="description"
                label="Description"
                placeholder="Text"
            ></LabeledInput>
            <LabeledInput
                id="link"
                label="Link"
                placeholder="www.example.com"
            ></LabeledInput>
            <LabeledInput
                id="image"
                label="Brand image"
                type="file"
            ></LabeledInput>
            {loading ? (
                <button disabled={true} type="submit">
                    Loading...
                </button>
            ) : (
                <button type="submit">Save</button>
            )}
        </form>
    )
}
