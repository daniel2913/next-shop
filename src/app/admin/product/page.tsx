import ProductForm from '@/hooks/modals/forms/useProductForm'
import styles from './page.module.scss'
import NewProductForm from '@/components/forms/NewProduct'
import CategoryForm from '@/hooks/modals/forms/useCategoryForm'
import useModalStore from '@/store/modalStore'
import { getAllBrands, getAllCategories } from '@/helpers/cachedGeters'

export default async function AddProductPage() {
	const [brandList,categoryList] = await Promise.all([getAllBrands(),getAllCategories()])
    return (  <ProductForm brandList={brandList} categoryList={categoryList}/>)
}
