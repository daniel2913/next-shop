import {useToastStore} from "../../store/modalStore"
import React from "react"

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
	return {show,error,info}
}
