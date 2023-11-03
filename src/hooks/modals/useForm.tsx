import useModalStore from '@/store/modalStore'
import { ReactElement, useEffect, useRef } from 'react'

export default function useForm(modalForm: ReactElement) {
    const modalState = useModalStore((state) => state.base)
    const formModalState = useModalStore((state) => state.form)
    const formData = useRef<(data: FormData | null) => void>()

    function show() {
        modalState.setModal(modalForm)
        modalState.show()
        return new Promise((resolve) => {
            formData.current = resolve
        })
    }

    useEffect(() => {
        if (formData.current && formModalState.accepted) {
            formData.current(formModalState.formFieldProps)
            formModalState.reset()
            modalState.close()
        }
    }, [formModalState, modalState])

    return show
}
