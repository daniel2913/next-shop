import {useToastStore} from "../../store/modalStore"
import { ServerErrorType } from "../useAction"

export default function useToast() {
	const _close= ()=>useToastStore.setState({isVisible:false})

	function show(description:string,title:string="",type:"error"|"info"="error") {
		useToastStore.setState({title,description,type,isVisible:true})
		setTimeout(()=>_close(),10000)
	}
	function error(description:string,title:string=""){
		useToastStore.setState({title,description,type:"error",isVisible:true})
		setTimeout(()=>_close(),10000)
	}
	function info(description:string,title:string=""){
		useToastStore.setState({title,description,type:"info",isVisible:true})
		setTimeout(()=>_close(),10000)
	}
	function handleResponse<T>(resp:T|ServerErrorType): resp is T{
		if (resp && typeof resp === "object" && "error" in resp){
			useToastStore.setState({title:resp.title||"Server response",description:resp.error,type:"error",isVisible:true})
			setTimeout(()=>_close(),10000)
			return false
		}
		return true
	}
	return {show,error,info, handleResponse}
}
