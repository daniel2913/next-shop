'use client'

import LabeledInput from '@/components/ui/LabeledInput'
import styles from './index.module.scss'
import Selector from '@/components/ui/Selector'
import { handleProductForm } from '@/actions/newProduct'
import { FormEvent, useState } from 'react'
import useError from '@/hooks/modals/useError'

export default function NewProductForm() {
    const [loading, setLoading] = useState(false)
    const error = useError()
    return (
        <form
            onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                e.preventDefault()
                setLoading(true)

                const result = await fetch('/api/product', {
                    method: 'PUT',
                    body: new FormData(e.currentTarget),
                })
                setLoading(false)
                error(await result.text())
            }}
            className={styles.productForm}
        >
            <fieldset>
                <LabeledInput
                    id="name"
                    placeholder="Product name"
                    label="Product name"
                />

                <Selector id="brand" label="Brand" type="brand" />

                <Selector id="category" label="Category" type="category" />
                <LabeledInput
                    id="price"
                    label="Price"
                    placeholder="11.99"
                    multiple={true}
                    type="number"
                />
                <LabeledInput
                    id="description"
                    label="Description"
                    placeholder="Description"
                />
                <LabeledInput
                    id="images"
                    label="Images"
                    multiple={true}
                    type="file"
                />
                {loading ? (
                    <button disabled={true} type="submit">
                        Loading...
                    </button>
                ) : (
                    <button type="submit">Save</button>
                )}
            </fieldset>
        </form>
    )
}
