'use client'
import LabeledInput from '@/components/ui/LabeledInput'
import styles from './index.module.scss'
import { useState } from 'react'
import useError from '@/hooks/modals/useError'
import { handleNewCategoryForm } from '@/actions/newCategory'

export default function NewCategoryForm() {
    const [loading, setLoading] = useState(false)
    const error = useError()
    return (
        <form
            onSubmit={() => setLoading(true)}
            action={async (formData: FormData) => {
                const result = await handleNewCategoryForm(formData)
                setLoading(false)
                error(result)
            }}
        >
            <LabeledInput
                id="name"
                label="Category name"
                placeholder="Category"
            ></LabeledInput>
            <LabeledInput
                id="image"
                label="Category image"
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
