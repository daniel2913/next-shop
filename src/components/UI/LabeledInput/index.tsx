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

    React.useEffect(() => {
        if (type != 'file' || !value || !_inpRef.current) {
            return
        }
        const data = new DataTransfer()
        if (multiple) {
            value.forEach((file) => data.items.add(file as File))
        } else {
            data.items.add(value as File)
        }
        _inpRef.current.files = data.files
    }, [value])

    return (
        <div className={`${className} ${styles.container}`}>
            <label htmlFor={id || ''} className={styles.label}>
                {label}
            </label>
            <input
                ref={_inpRef.current}
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
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    //if (!e.target.files) return false
                    //const files = Object.values(e.target.files)
                    const files = e.target.files
                    if (type === 'file') {
                        if (
                            validate(
                                (!multiple && e.target.files?.[0]) ||
                                (multiple && e.target.files),
                                validation
                            )
                        ) {
                            setValue(e.target.files)
                        }
                    }
                }}
            />
            <label htmlFor={id || ''} className={styles.error}>
                {_error}
            </label>
        </div>
    )
}
