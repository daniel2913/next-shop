'use client'

import LabeledInput from '@/components/UI/LabeledInput'
import styles from './index.module.scss'
import Selector from '@/components/UI/Selector'
import { handleProductForm } from '@/Actions/newProduct'
import { useState } from 'react'
import useError from '@/hooks/modals/useError'

export default function NewProductForm() {
    const [loading, setLoading] = useState(false)
    const error = useError()
    return (
        <form
            action={async (formData: FormData) => {
                const result = await handleProductForm(formData)
                setLoading(false)
                error(result)
            }}
            className={styles.productForm}
        //onSubmit={()=>setLoading(true)}
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
