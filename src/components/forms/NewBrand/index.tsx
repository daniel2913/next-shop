'use client'
import LabeledInput from '@/components/ui/LabeledInput'
import styles from './index.module.scss'
import { FormEvent, useState } from 'react'
import useError from '@/hooks/modals/useError'

export default function NewBrandForm() {
    const [loading, setLoading] = useState(false)
    const error = useError()
    return (
        <form
            onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                e.preventDefault()
                setLoading(true)

                const result = await fetch('/api/brand', {
                    method: 'PUT',
                    body: new FormData(e.currentTarget),
                })
                setLoading(false)
                error(await result.text())
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
