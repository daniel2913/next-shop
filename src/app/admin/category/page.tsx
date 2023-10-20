import NewCategoryForm from '@/components/forms/Category/newCategory'
import styles from './page.module.scss'

export default function Category() {
    return (
        <div className={styles.pageWrapper}>
            <h1>Add new Brand</h1>
            <NewCategoryForm />
        </div>
    )
}
