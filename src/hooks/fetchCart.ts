import {useSession} from 'next-auth/react'
import useCartStore from '../store/cartStore/index'
import useConfirm from '../hooks/modals/useConfirm'
export default function useFetchCart(){
	const {data} = useSession()
	const localCache = useCartStore(state=>state.items)
	const setLocalCache = useCartStore(state=>state.setItems)

	const confirmOverwrite = useConfirm(
		"Do you want to use your local cart cache?",
	)
		async function getCache() {
			if (data?.user?.role!=='user') return false
			const remoteCache = await (await fetch("api/store")).json()
			if (remoteCache.length > 0) {
				if (!localCache?.length) {
					setLocalCache(remoteCache)
				} else if (JSON.stringify(remoteCache) !== JSON.stringify(localCache)) {
					confirmOverwrite().then((ans) => {
						if (!ans) {
							setLocalCache(remoteCache)
						}
					})
				}
			}
		}
		return getCache
	}
