import { Button } from "@/components/material-tailwind"
import React from "react"
import useModal from "./useModal"

export default function useConfirm(defaultMessage = "Are you sure?") {
	const {show:_show,close} = useModal()
	
	function show(message?:string) {
		let resolver:(res:boolean)=>void
		const result = new Promise((resolve) => {
			resolver = (res:boolean)=>{
				resolve(res)
				close()
				}
		})
		_show(<ModalConfirm resolver={resolver} message={message || defaultMessage}/> )
		return result
		}
	return show
}

function ModalConfirm(props: {message:string,resolver:(ans:boolean)=>void}) {
	return (
		<>
			<p
				className="mb-4 text-lg font-medium"
			>{props.message}</p>
			<div className="flex justify-center gap-16">
				<Button
					color="light-green"
					type="button"
					onClick={()=>{props.resolver(true)}}
				>
					Yes
				</Button>
				<Button
					color="red"
					type="button"
					onClick={()=>props.resolver(false)}
				>
					No
				</Button>
			</div>
		</>
	)
}


