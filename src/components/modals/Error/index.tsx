import useModalStore from '@/store/modalStore'
import styles from './index.module.scss'
interface props {
    message: string
}

export default function ModalError({ message }: props) {
    const modal = useModalStore((state) => state.base)
    return (
        <>
            <h1>You made Fucky-Wacky!</h1>
            <p>{message}</p>
            <button onClick={() => modal.close()}>Get into forever-box</button>
        </>
    )
}
