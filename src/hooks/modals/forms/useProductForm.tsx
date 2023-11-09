'use client'
import useModalStore from '@/store/modalStore'
import Form, {
    FormFieldValidator,
    FormFieldValue,
} from '../../../components/forms/index'
import React from 'react'
import LabeledInput from '@/components/ui/LabeledInput'

const formFieldValues: {
    name: string
    description: string
    brand: string
    price: string
    discount: string
    link: string
    category: string
    images: null
} = {
    name: '1',
    description: '2',
    brand: '3',
    price: '',
    discount: '',
    link: '',
    category: '',
    images: null,
}
const action = '/api/product'

const validation: { [i in keyof typeof formFieldValues]: FormFieldValidator } =
{
    name: (value: FormFieldValue) => {
        if (typeof value != 'string')
            return { valid: false, msg: 'Name can only be string!' }

        return value.length === 0
            ? { valid: false, msg: 'Name Required!' }
            : { valid: true }
    },
    images: (value: FormFieldValue) => {
        if (typeof value === 'string')
            return { valid: false, msg: 'Image can only be a file!' }
        if (!value) return { valid: true }
        const files = value instanceof File ? [value] : value
        if (files.length === 0) return { valid: false, msg: 'zalupa' }
        for (const file of files) {
            const ext = file.name.split('.').pop()
            if (ext != 'jpeg' && ext != 'jpg')
                return { valid: false, msg: 'Only jpegs!' }
            if (file.size > 1024 * 512)
                return { valid: false, msg: 'Only under 0.5MB!' }
        }
        return { valid: true }
    },
    description: (value: FormFieldValue) => {
        if (typeof value != 'string')
            return { valid: false, msg: 'Description can only be string!' }
        return value.length === 0
            ? { valid: false, msg: 'Description required' }
            : { valid: true }
    },
    link: (value: FormFieldValue) => {
        return typeof value != 'string'
            ? { valid: false, msg: 'Link can only be string!' }
            : { valid: true }
    },
    brand: (value: FormFieldValue) => {
        return typeof value != 'string'
            ? { valid: false, msg: 'Brand can only be string!' }
            : { valid: true }
    },
    category: (value: FormFieldValue) => {
        return typeof value != 'string'
            ? { valid: false, msg: 'Category can only be string!' }
            : { valid: true }
    },
    price: (value: FormFieldValue) => {
        return isNaN(Number(value))
            ? { valid: false, msg: 'Price can only be number!' }
            : { valid: true }
    },
    discount: (value: FormFieldValue) => {
        return isNaN(Number(value))
            ? { valid: false, msg: 'Price can only be number!' }
            : { valid: true }
    },
}

const fieldProps: {
    [i in keyof typeof formFieldValues]: Omit<
        React.ComponentProps<typeof LabeledInput>,
        'value' | 'setValue'
    >
} = {
    name: {
        id: 'name',
        type: 'text',
        label: 'Product name',
        placeholder: 'Product',
        validator: validation['name'],
    },
    description: {
        id: 'description',
        type: 'text',
        label: 'Product description',
        placeholder: 'Text',
        validator: validation['description'],
    },
    link: {
        id: 'link',
        type: 'text',

        label: 'Product link',
        placeholder: 'example.com',
        validator: validation['link'],
    },
    brand: {
        id: 'brand',
        label: 'Product brand',
        placeholder: 'test',
        validator: validation['brand'],
        type: 'select',
    },
    category: {
        id: 'category',
        type: 'select',
        label: 'Product category',
        placeholder: 'test',
        validator: validation['category'],
    },
    price: {
        id: 'price',
        type: 'text',
        label: 'Product price',
        placeholder: 'test',
        validator: validation['price'],
    },
    discount: {
        id: 'discount',
        type: 'text',
        label: 'Product discount',
        placeholder: 'test',
        validator: validation['discount'],
    },
    images: {
        id: 'image',
        label: 'Product image',
        type: 'file',
        multiple: true,
        accept: 'image/jpeg',
        validator: validation['images'],
    },
}

export default function ProductForm() {
    const [fieldValues, setFieldValues] = React.useState(formFieldValues)
    const [brands, setBrands] = React.useState<string[]>(['Loading...'])
    const [categories, setCategories] = React.useState<string[]>(['Loading...'])
    fieldProps.brand.options = brands
    fieldProps.category.options = categories
    React.useEffect(() => {
        function getLists() {
            Promise.all([fetch('/api/category'), fetch('/api/brand')])
                .then(([cats, brands]) => {
                    Promise.all([cats.json(), brands.json()]).then(
                        ([cats, brands]) => {
                            console.log(cats, brands)
                            setCategories(cats.map((cat) => cat.name))
                            setBrands(brands.map((brand) => brand.name))
                        }
                    )
                })
                .catch((er) => console.log(er))
        }
        getLists()
    }, [])
    return (
        <div style={{ display: 'flex' }}>
            <Form
                action={action}
                method="PUT"
                fieldValues={fieldValues}
                fieldProps={fieldProps}
                setFieldValues={setFieldValues}
            />
        </div>
    )
}
