"use client"
import { LocalModal } from "@/components/modals/Base"
import React from "react"

type ModalChildren<T> = (close: (val: T) => void) => React.ReactNode

type ModalContext = <T>(props: {
	children: ModalChildren<T>
	title: string
}) => Promise<T>


export const ModalContext = React.createContext<ModalContext>((val: any) => Promise.resolve(val))


export default function GlobalModalProvider(props: { children: React.ReactNode }) {
	const [isOpen, setIsOpen] = React.useState(false)
	const [children, setChildren] = React.useState<React.ReactNode>(null)
	const [title, setTitle] = React.useState("Modal")

	const show = React.useCallback(function show<T>(props: Parameters<ModalContext>[0]) {
		let resolve: ((val: T) => void) = () => undefined
		const result = new Promise(r => { resolve = r })
		setIsOpen(true)
		setChildren(props.children((val: T) => { resolve(val); setIsOpen(false) }))
		setTitle(props.title)
		return result
	}, [])
	return (
		<>
			<ModalContext.Provider value={show}>
				{props.children}
			</ModalContext.Provider>
			<LocalModal title={title} isOpen={isOpen} close={() => setIsOpen(false)} children={children} />
		</>
	)
}
