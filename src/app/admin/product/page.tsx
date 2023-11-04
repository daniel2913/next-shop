import ProductForm from '@/hooks/modals/forms/useProductForm'
import styles from './page.module.scss'
import NewProductForm from '@/components/forms/NewProduct'
import CategoryForm from '@/hooks/modals/forms/useCategoryForm'

export default function AddProductPage() {
    return (
        <div className={styles.pageWrapper}>
            <h1 className={styles.pageTitle}>Add Product</h1>
            <ProductForm />
        </div>
    )
}
