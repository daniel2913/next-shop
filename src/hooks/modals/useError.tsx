import useModalStore from '@/store/modalStore'
import { useEffect, useRef } from 'react'
import ModalError from '@/components/modals/Error'

export default function useError() {
    const modalState = useModalStore((state) => state.base)

    function show(message = 'Fucky-Wacky were made') {
        modalState.setModal(<ModalError message={message} />)
        modalState.show()
    }
    return show
}
