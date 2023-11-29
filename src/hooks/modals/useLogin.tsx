import useModalStore from '../../store/modalStore'
import Login from '../../components/modals/Login'
import React from 'react'

export default function useLogin(){
	const modal = useModalStore(state=>state.base)
	return ()=>{
	modal.setModal(<Login close={modal.close}/>)

	}
}
