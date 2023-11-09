'use client'
import ProductForm from '@/hooks/modals/forms/useProductForm'
import styles from './page.module.scss'
import NewProductForm from '@/components/forms/NewProduct'
import CategoryForm from '@/hooks/modals/forms/useCategoryForm'
import useModalStore from '@/store/modalStore'

export default function AddProductPage() {
    const { show, setModal } = useModalStore((state) => state.base)
    function productClick() {
        setModal(<ProductForm />)
        show()
    }
    function categoryClick() {
        setModal(<CategoryForm method="PUT" />)
        show()
    }
    return (
        <div className={styles.pageWrapper}>
            <h1 className={styles.pageTitle}>Add Product</h1>
            <button onClick={productClick}>New Product</button>
            <button onClick={categoryClick}>New Category</button>
        </div>
    )
}
