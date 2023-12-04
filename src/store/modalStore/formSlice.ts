import LabeledInput from "@/components/ui/LabeledInput"
import {
	ComponentProps,
	FunctionComponent,
	ReactElement,
} from "react"
import { StateCreator } from "zustand"

type props = Omit<
	ComponentProps<typeof LabeledInput>,
	"value" | "setValue"
>
export interface ModalFormSlice {
	form: {
		formFieldProps: {
			[i in keyof ModalFormSlice["form"]["formFieldValues"]]: props
		}
		formFieldValues: { [i: string]: string | FileList | File }
		accepted: boolean
		action: string
		setFormFieldValues: (newValues: {
			[i: string]: string | FileList | File
		}) => void
		setFormFieldProps: (props: {
			[i in keyof ModalFormSlice["form"]["formFieldValues"]]: props
		}) => void
		reset: () => void
	}
}

export const createModalFormSlice: StateCreator<
	ModalFormSlice
> = (set) => ({
	form: {
		formFieldValues: {},
		formFieldProps: {},
		accepted: true,
		action: "api/test",
		setFormFieldProps: (props) =>
			set((state) => {
				return { form: { ...state.form, formFieldProps: props } }
			}),
		setFormFieldValues: (newValues) =>
			set((state) => {
				return { form: { ...state.form, ...newValues } }
			}),
		reset: () =>
			set((state) => {
				return {
					form: { ...state.form, formFieldValues: {} },
				}
			}),
	},
})
