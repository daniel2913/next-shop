import ToastBase from "@/components/modals/Base"


export const ToastState = {
	info: (d, t) => console.log(`Info, desc: ${d}, title: ${t}`),
	error: (d, t) => console.log(`Error, desc: ${d}, title: ${t}`),
	isValidResponse: (d:any) => true
}

let _ToastState
export function useToastStore(selector: (val: any) => any) {
	selector ? selector(_ToastState) : _ToastState
}
useToastStore.getState = ()=>_ToastState


export function ToastDecorator (Story,{parameters}){
	if (parameters?.ToastState)
		_ToastState = parameters.ToastState
	return (
		<>
			<Story parameters/>
			<ToastBase/>
		</>
	)
}
