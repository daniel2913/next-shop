import styles from './index.module.scss'
import useModalStore from '@/store/modalStore'

interface props {
    message: string
}

export default function ModalConfirm({ message }: props) {
    const { accept, reject } = useModalStore((state) => state.confirm)
    return (
        <>
            <p>{message}</p>
            <div className={styles.answer}>
                <button onClick={accept}>Yes</button>
                <button onClick={reject}>No</button>
            </div>
        </>
    )
}
