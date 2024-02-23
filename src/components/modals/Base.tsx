"use client"
import { useModalStore } from "@/store/modalStore"
import React, { useEffect } from "react"
import useResponsive from "@/hooks/useResponsive"
import Cross from "@public/cross.svg"
import { RemoveScroll } from "react-remove-scroll"
import Loading from "../ui/Loading"
import dynamic from "next/dynamic"

const MobileModal = dynamic(()=>import("./MobileBase"))

export default function ModalBase() {
	const { open, title, children, onClose, forceWindow, clear } = useModalStore()
	const ref = React.useRef<HTMLDialogElement>(null)
	const mode = useResponsive()
	useEffect(() => {
		if (open) {
			ref.current?.showModal()
		} else {
			ref.current?.close()
		}
	}, [open])
	if (forceWindow || mode === "desktop")
		return (
			<dialog
				className="fixed rounded-md p-4"
				onClose={() => {
					onClose()
					clear()
				}}
				ref={ref}
				aria-modal
			>
				<div 
					className="fixed z-[-50] bg-black opacity-60 w-full h-full scale-[10]"
					onClick={clear}
					onKeyDown={(e)=>{if(e.key==="Esc") clear()}}
				/>
				<div className="h-full w-full z-50">			
				<button
					type="button"
					className="absolute right-1 top-1 rounded-sm bg-accent"
					onClick={() => {
						onClose()
						clear()
					}}
				>
					<Cross
						width={17}
						height={17}
						className="*:fill-white *:stroke-white"
					/>
				</button>
				<h2 className="text-center text-3xl font-bold capitalize">{title}</h2>
				<div
					onSubmit={() => {
						clear()
					}}
					className="flex h-fit max-h-[80vh] w-fit max-w-[95vw] items-center justify-center rounded-md p-2"
				>
					<RemoveScroll removeScrollBar={open}>
						<Loading>
						{children}
						</Loading>
					</RemoveScroll>
				</div>
				</div>
			</dialog>
		)
	return (
		<MobileModal/>
	)
}
