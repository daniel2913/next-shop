"use client"

import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "./Button"

export function Toaster() {
	const { toasts } = useToast()

	return (
		<ToastProvider>
			{toasts.map(function({ id, title, description, action, ...props }) {
				return (
					<Toast className={`${props.actions ? "flex flex-col gap-2" : ""}`} key={id} {...props}>
						<div className="grid gap-1">
							{title && <ToastTitle>{title}</ToastTitle>}
							{description && (
								<ToastDescription>{description}</ToastDescription>
							)}
						</div>
						{!props.actions && action}
						<ToastClose />
						{props.actions && <div className="flex gap-2 flex-wrap">{props.actions?.map(action =>
							<Button key={action.name} onClick={action.onClick} >
								{action.name}
							</Button>
						)}</div>}
					</Toast>
				)
			})}
			<ToastViewport />
		</ToastProvider>
	)
}
