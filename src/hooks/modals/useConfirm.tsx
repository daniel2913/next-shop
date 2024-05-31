import React, { useContext } from "react";
import ModalConfirm from "@/components/modals/Confirm";
import { ModalContext } from "@/providers/ModalProvider";

export default function useConfirm(defMessage = "Are you sure?", defTitle = "Confirmation") {
	const show = useContext(ModalContext)
	return (message?: string, title?: string) => show({
		title: title || defTitle,
		children: (close: (val: boolean) => void) => <ModalConfirm resolver={close} message={message || defMessage} />
	})
}
