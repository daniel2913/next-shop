'use client'
import LabeledInput from '@/components/ui/LabeledInput'
import styles from './index.module.scss'
import { ComponentProps, FormEvent, useRef, useState } from 'react'
import useError from '@/hooks/modals/useError'

export type FormFieldNames = { [key: string]: string | null }
export type FormFieldValue = FormDataEntryValue | FileList | null
export type FormFieldValidator = (
    v: FormFieldValue
) => { valid: true; msg?: string } | { valid: false; msg: string }
export type FormFieldProps = Omit<
    ComponentProps<typeof LabeledInput>,
    'value' | 'setValue'
>

type props<T extends { [key: string]: FormFieldValue }> = {
    dataFields: T
    setDataFields: React.Dispatch<React.SetStateAction<T>>
    fieldValues: { [key in keyof T]: FormFieldProps }
    action: string
} & (
    | {
          method: 'PUT'
      }
    | {
          method: 'PATCH'
          targId?: string
          targName?: string
      }
)

export default function Form<T extends { [key: string]: string | null }>({
    dataFields,
    setDataFields,
    fieldValues,
    ...params
}: props<T>) {
    const [loading, setLoading] = useState(false)
    const error = useError()
    async function submitHandler(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = new FormData()
        if (params.method === 'PATCH') {
            if (params.targId) {
                form.append('targId', params.targId)
            } else if (params.targName) {
                form.append('targName', params.targName)
            }
        }
        let valid = true
        for (const [key, value] of Object.entries(dataFields) as [
            keyof T,
            FormDataEntryValue
        ][]) {
            form.append(key.toString(), value)
            if (fieldValues[key].validator) {
                const entryValid = fieldValues[key].validator!(value)
                if (!entryValid.valid) {
                    valid = false
                    break
                }
            }
        }
        if (!valid) {
            return false
        }
        setLoading(true)
        const result = await fetch(params.action, {
            method: params.method,
            body: form,
        })
        setLoading(false)
        error(await result.text())
    }

    return (
        <form onSubmit={submitHandler}>
            {Object.entries(fieldValues).map(([key, props]) => (
                <LabeledInput
                    key={key}
                    value={dataFields[key as keyof FormFieldNames]}
                    setValue={(val: FormFieldValue) =>
                        setDataFields({ ...dataFields, [key]: val })
                    }
                    {...props}
                />
            ))}
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
