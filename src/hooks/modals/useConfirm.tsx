import { Button } from "@/components/UI/button"
import React from "react"
import { useModalStore } from "@/store/modalStore"

export default function useConfirm(defaultMessage = "Are you sure?") {
	const clear = useModalStore(state=>state.clear)
	function show(message?: string) {
		return new Promise((res) => {
			useModalStore.setState({
				children: <ModalConfirm
					resolver={(val: boolean) => {
						res(val)
						clear()
					}}
					message={message || defaultMessage}
				/>,
				open:true,
				title:"Confirmation",
				header:"Are you sure?",
				onClose:()=>res(false),
				}
			)
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


