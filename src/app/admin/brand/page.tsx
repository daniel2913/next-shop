import NewBrandForm from '@/components/forms'
import styles from './page.module.scss'

export default function Brand() {
    return (
        <div className={styles.pageWrapper}>
            <h1>Add new Brand</h1>
            <NewBrandForm />
        </div>
    )
}
