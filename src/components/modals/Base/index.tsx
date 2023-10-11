'use client'
import useModalStore from '@/store/modalStore'
import styles from './index.module.scss'
import React from 'react'

export default function ModalBase() {
    const { isVisible, content } = useModalStore((state) => state.base)
    return (
        <dialog className={styles.modal} open={isVisible}>
            {content}
        </dialog>
    )
}
