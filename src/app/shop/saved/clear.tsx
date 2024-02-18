"use client"

import { clearSavedAction } from "@/actions/savedProducts"
import { Button } from "@/components/ui/Button"
import { useRouter } from "next/navigation"

type Props = {
	className?:string
}
export default function ClearSaved(props:Props){
	const router = useRouter()
	return(
		<Button
			className={`${props.className} fixed z-10 top-14 left-4`}
			onClick={async()=>clearSavedAction().then(_=>router.refresh())}
		>
			Clear Saved
		</Button>
	)
}
