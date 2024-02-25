"use client"

import { clearSavedAction } from "@/actions/saved"
import { Button } from "@/components/ui/Button"
import useCartStore from "@/store/cartStore"
import { useRouter } from "next/navigation"

type Props = {
	className?: string
}
export default function ClearSaved(props: Props) {
	const router = useRouter()
	return (
		<Button
			className={`${props.className} fixed left-4 top-4 z-10 md:top-14`}
			onClick={async () => {
				clearSavedAction().then((_) => router.push("/shop/home"))
				useCartStore.setState({ saved: [] })
			}}
		>
			Clear Saved
		</Button>
	)
}
