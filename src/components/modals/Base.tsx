"use client";
import React from "react";
import useResponsive from "@/hooks/useResponsive";
import Cross from "@public/cross.svg";
import { RemoveScroll } from "react-remove-scroll";
import Loading from "../ui/Loading";
import dynamic from "next/dynamic";

const MobileModal = dynamic(() => import("./MobileBase"));

type LocalModalProps = {
	children: React.ReactNode
	isOpen: boolean
	close: () => void
	forceWindow?: boolean
	onClose?: () => void
}

export function LocalModal(props: LocalModalProps) {
	const ref = React.useRef<HTMLDialogElement>()
	const mode = useResponsive();
	if (!props.isOpen) return null
	if (!props.forceWindow && mode === "mobile")
		return <Loading><MobileModal {...props} /></Loading>
	return (
		<Loading>
			<dialog
				className="fixed rounded-md"
				ref={e => {
					if (!e) {
						document.body.style.overflowY = "auto"
						props.onClose?.()
						props.close()
						return
					}
					e?.showModal()
					document.body.style.overflowY = "hidden"
					ref.current = e
					return
				}}
				aria-modal
				onKeyDown={(e) => {
					if (e.key === "Escape") {
						e.stopPropagation()
						e.preventDefault()
						props.close()
					}
				}}
			>
				<div
					className="fixed z-[-50] h-full w-full scale-[10] bg-black opacity-60"
					onClick={props.close}
				/>
				<div className="z-50 border-white  h-full w-full">
					<button
						type="button"
						className="absolute right-1 top-1 rounded-sm bg-accent"
						onClick={props.close}
					>
						<Cross
							width={17}
							height={17}
							className="*:fill-white *:stroke-white"
						/>
					</button>
					<div
						onSubmit={props.close}
						className="flex h-fit max-h-[80vh] w-fit max-w-[95vw] items-center justify-center rounded-md p-2"
					>
						<RemoveScroll removeScrollBar={props.isOpen}>
							{props.children}
						</RemoveScroll>
					</div>
				</div>
			</dialog >
		</Loading>
	);
}

