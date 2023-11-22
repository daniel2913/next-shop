import useModalStore from '@/store/modalStore'
import { useEffect, useRef } from 'react'
import ModalError from '@/components/modals/Error'

export default function useError(defMessage = "Error!") {
    const modalState = useModalStore((state) => state.base)

    function show(message: string) {
        modalState.setModal(<ModalError message={message || defMessage} />)
        modalState.show()
    }
    return show
}
