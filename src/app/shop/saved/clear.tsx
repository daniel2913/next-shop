"use client"

import { clearSavedAction } from "@/actions/saved"
import { Button } from "@/components/ui/Button"
import { useRouter } from "next/navigation"

type Props = {
	className?: string
}
export default function ClearSaved(props: Props) {
	const router = useRouter()
	return (
		<Button
			className={`${props.className} fixed left-4 top-14 z-10`}
			onClick={async () =>
				clearSavedAction().then((_) => router.push("/shop/home"))
			}
		>
			Clear Saved
		</Button>
	)
}
