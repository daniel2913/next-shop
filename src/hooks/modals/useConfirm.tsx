import { Button } from "@/components/UI/button"
import React from "react"
import { useModalStore } from "@/store/modalStore"

export default function useConfirm(defaultMessage = "Are you sure?") {
	function show(message?: string) {
		const { dialogRef, setContent } = useModalStore.getState()
		return new Promise(res => {
			setContent(<ModalConfirm
				resolver={(val: boolean) => {
					res(val)
					dialogRef?.current?.close()
				}}
				message={message || defaultMessage}
			/>)
			dialogRef?.current?.show()
		})
	}
	return show
}

function ModalConfirm(props: { message: string, resolver: (ans: boolean) => void }) {
	return (
		<div>
			<p
				className="mb-4 text-lg font-medium"
			>{props.message}</p>
			<div className="flex justify-center gap-16">
				<Button
					onClick={() => { props.resolver(true) }}
				>
					Yes
				</Button>
				<Button
					onClick={() => props.resolver(false)}
				>
					No
				</Button>
			</div>
		</div>
	)
}


