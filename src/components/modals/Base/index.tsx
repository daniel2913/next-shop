'use client'
import useModalStore from '@/store/modalStore'
import styles from './index.module.scss'
import React from 'react'

export default function ModalBase() {
    const { isVisible, content, close } = useModalStore((state) => state.base)
    return (
        <dialog className={styles.modal} open={isVisible}>
            <button onClick={close} className={styles.close}>
                X
            </button>
            {content}
        </dialog>
    )
}
