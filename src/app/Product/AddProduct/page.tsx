import styles from './page.module.scss'
import NewProductForm from '@/components/forms/Product/NewProduct'

export default function AddProductPage() {
    return (
        <div className={styles.pageWrapper}>
            <h1 className={styles.pageTitle}>Add Product</h1>
            <NewProductForm />
        </div>
    )
}
