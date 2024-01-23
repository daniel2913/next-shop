"use client"
import {useToastStore} from "../../store/modalStore"
import React from "react"

export default function useToast() {
	// const {show:_show,close:_close,setModal, isVisible, content} = useToastStore(state=>state)
	//
	// function show(Modal: React.ReactElement|string) {
	// 	setModal(Modal)
	// 	_show()
	// 	setTimeout(_close,2000)
	// }

	return { show:()=>null, isVisible:false, content:null}
}
