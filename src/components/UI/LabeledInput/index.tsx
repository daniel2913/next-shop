'use client'
import { FormFieldValidator, FormFieldValue } from '@/components/forms'
import styles from './index.module.scss'
import React, { HTMLInputTypeAttribute } from 'react'

type props = {
    label?: string
    placeholder?: string
    type?: string
    className?: string
    id: string
    value: FormFieldValue
    multiple?: boolean
    accept?: string
    setValue: (val: FormFieldValue) => void
    validator?: FormFieldValidator
}

export default function LabeledInput({
    label = 'default label',
    multiple = false,
    accept = 'image/*',
    placeholder = 'input',
    type = 'text',
    className = '',
    id,
    value,
    setValue,
    validator: validation,
}: props) {
    const [_error, _setError] = React.useState<string>('')
    const _inpRef = React.useRef<HTMLInputElement>(null)
    function validate(value: props['value'], validation: props['validator']) {
        if (validation) {
            const err = validation(value)
            if (!err.valid) {
                _setError(err.msg)
                return false
            } else {
                _setError('')
                return true
            }
        }
    }
    function changeHandler(e: React.ChangeEvent<HTMLInputElement>) {
        if (type === 'file') {
            const files = e.currentTarget.files
            if (
                validate(
                    (!multiple && files?.[0]) || (multiple && files),
                    validation
                )
            ) {
                console.log('==>', { ...files })
                setValue(multiple ? { ...files } : { ...files }[0])
            }
        } else {
            setValue(e.currentTarget.value)
        }
    }

    React.useEffect(() => {
        if (type != 'file' || !value || !_inpRef.current) {
            return
        }
        const data = new DataTransfer()
        if (multiple) {
            for (const idx in value) {
                data.items.add(value[idx] as File)
            }
        } else {
            console.log(value)
            data.items.add(value)
        }
        _inpRef.current.files = data.files
    }, [value, multiple, type])

    return (
        <div className={`${className} ${styles.container}`}>
            <label htmlFor={id || ''} className={styles.label}>
                {label}
            </label>
            <input
                ref={_inpRef}
                multiple={multiple}
                accept={accept}
                onBlur={() => validate(value, validation)}
                id={id}
                name={id}
                className={`${styles.input} ${(_error != '' && styles.inputError) || ''
                    }`}
                type={type}
                placeholder={placeholder}
                value={typeof value === 'string' ? value : ''}
                onChange={changeHandler}
            />
            <label htmlFor={id || ''} className={styles.error}>
                {_error}
            </label>
        </div>
    )
}
