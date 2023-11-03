'use client'
import useModalStore from '@/store/modalStore'
import Form, {
    FormFieldValidator,
    FormFieldValue,
} from '../../../components/forms/index'
import React, { useEffect, useMemo, useState } from 'react'
import ProductCard from '@/components/product/ProductCard'
import PreviewProductCard from '@/components/product/ProductCard/PreviewProductCard'
import ImagesPreview from '@/components/ui/ImagesPreview'

const formFieldValues: {
    name: string
    description: string
    brand: string
    price: string
    discount: string
    link: string
    category: string
    images: FileList | string
} = {
    name: '1',
    description: '2',
    brand: '3',
    price: '',
    discount: '',
    link: '',
    category: '',
    images: '',
}
const action = 'api/product'

const validation: { [i in keyof typeof formFieldValues]: FormFieldValidator } = {
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
        console.log(value, value instanceof FileList)
        const files = value instanceof File ? [value] : value
		if (files.length === 0) return {valid:false,msg:'zalupa'}
        for (const file of files) {
			if (typeof file ==='number' || !file) continue
            console.log(file.name.split('.').pop())
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

const formFieldProps = {
    name: {
        id: 'name',
        label: 'Product name',
        placeholder: 'Product',
        validator: validation['name'],
    },
    description: {
        id: 'description',
        label: 'Product description',
        placeholder: 'Text',
        validator: validation['description'],
    },
    link: {
        id: 'link',
        label: 'Product link',
        placeholder: 'example.com',
        validator: validation['link'],
    },
    brand: {
        id: 'brand',
        label: 'Product brand',
        placeholder: 'test',
        validator: validation['brand'],
    },
    category: {
        id: 'category',
        label: 'Product category',
        placeholder: 'test',
        validator: validation['category'],
    },
    price: {
        id: 'price',
        label: 'Product price',
        placeholder: 'test',
        validator: validation['price'],
    },
    discount: {
        id: 'discount',
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
} as const

function previewImages(images: File[] | null) {
    if (!images) return ['template.jpeg']
    const res: string[] = []
    for (const image of images) {
        res.push(URL.createObjectURL(image))
    }
    return res
}

export default function useProductForm() {
    const {setFormFieldProps,setFormFieldValues,formFieldProps,formFieldValues} = useModalStore(state=>state.form)
    const modalState = useModalStore((state) => state.base)
	console.log('Render!')
	setFormFieldProps(formFieldProps)
	setFormFieldValues(formFieldValues)

    function show() {
        modalState.setModal(
            <div style={{ display: 'flex' }}>
				<button onClick={()=>setFormFieldValues({...formFieldValues,name:'zalupa'})}>XXXX</button>
                <Form
                    action={action}
                    method="PUT"
                    fieldValues={formFieldValues}
                    dataFields={formFieldProps}
                    setDataFields={setFormFieldValues}
                />
                {/* <ImagesPreview
                    images={imagesPreviews}
                    delImage={(idx) => {
                        URL.revokeObjectURL(imagesPreviews[idx])
                        setDataFields((prev) => {
                            return {
                                ...prev,
                                images: prev.images.filter(
                                    (_, oldIdx) => oldIdx != idx
                                ),
                            }
                        })
                    }}
                /> */}
            </div>
        )
        modalState.show()
    }
    return show
}
