'use client'
import styles from './index.module.scss'
import React from 'react'
interface props {
    label?: string
    placeholder?: string
    type?: string
    className?: string
    value?: string
    id?: string
    error?: string
    multiple?: boolean
    accept?: string
    validation?: (inp: string) => string | false
}

export default function LabeledInput({
    label = 'default label',
    error = '',
    multiple = false,
    accept = 'image/*',
    placeholder = 'input',
    type = 'text',
    className = '',
    id,
    validation,
}: props) {
    const [_value, _setValue] = React.useState('')
    const [_error, _setError] = React.useState(error)

    function validate() {
        if (validation && _value != '') {
            const err = validation(_value)
            if (err) {
                _setError(err)
            } else _setError('')
        }
    }

    return (
        <div className={`${className} ${styles.container}`}>
            <label htmlFor={id || ''} className={styles.label}>
                {label}
            </label>
            <input
                multiple={multiple}
                accept={accept}
                onBlur={validate}
                id={id}
                name={id}
                className={`${styles.input} ${
                    (_error != '' && styles.inputError) || ''
                }`}
                type={type}
                placeholder={placeholder}
                value={_value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    _setValue(e.target.value)
                }
            />
            <label htmlFor={id || ''} className={styles.error}>
                {_error}
            </label>
        </div>
    )
}
